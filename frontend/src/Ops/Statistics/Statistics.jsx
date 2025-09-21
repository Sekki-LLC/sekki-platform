import React, { useMemo, useState } from 'react';
import styles from './Statistics.module.css';
import ResourcePageWrapper from '../../All/components/ResourcePageWrapper';
import { useAdminSettings } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

/* Minimal in-browser engine with pluggable provider. */
function analyzeLocal({ task, data, options }) {
  const cols = data.columns;
  const rows = data.rows;

  const isNumericCol = (c) => cols[c].type === 'numeric';
  const numericCols = Object.keys(cols).filter(isNumericCol);
  const categoricalCols = Object.keys(cols).filter((c) => cols[c].type === 'categorical');

  const stats = {
    describe: {},
    freq: {},
    correlations: [],
    groups: {},
    chiSquare: null,
  };

  const toNum = (v) => (v === null || v === '' ? null : Number(v));
  const validNums = (name) => rows.map((r) => toNum(r[name])).filter((v) => Number.isFinite(v));

  if (task === 'describe' || task === 'auto') {
    numericCols.forEach((name) => {
      const arr = validNums(name);
      if (arr.length === 0) return;
      const n = arr.length;
      const mean = arr.reduce((a, b) => a + b, 0) / n;
      const sd = Math.sqrt(arr.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1 || 1));
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      stats.describe[name] = { n, mean, sd, min, max };
    });
    categoricalCols.forEach((name) => {
      const f = {};
      rows.forEach((r) => {
        const v = r[name] ?? '';
        f[v] = (f[v] || 0) + 1;
      });
      stats.freq[name] = Object.entries(f).map(([k, v]) => ({ level: k, count: v }));
    });
  }

  if ((task === 'association' || task === 'auto') && numericCols.length >= 2) {
    for (let i = 0; i < numericCols.length; i++) {
      for (let j = i + 1; j < numericCols.length; j++) {
        const a = numericCols[i], b = numericCols[j];
        const A = [], B = [];
        rows.forEach((r) => {
          const va = toNum(r[a]), vb = toNum(r[b]);
          if (Number.isFinite(va) && Number.isFinite(vb)) {
            A.push(va); B.push(vb);
          }
        });
        const n = A.length;
        if (n < 3) continue;
        const mean = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;
        const ma = mean(A), mb = mean(B);
        const cov = A.reduce((s, v, k) => s + (v - ma) * (B[k] - mb), 0) / (n - 1);
        const sd = (arr, m) => Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (n - 1));
        const ra = sd(A, ma), rb = sd(B, mb);
        const r = cov / (ra * rb || 1);
        stats.correlations.push({ a, b, r });
      }
    }
  }

  if ((task === 'compare' || task === 'auto') && options?.groupCol && options?.targetCol) {
    const g = {};
    const groupBy = options.groupCol;
    const target = options.targetCol;
    rows.forEach((r) => {
      const gk = String(r[groupBy] ?? '');
      const v = toNum(r[target]);
      if (!Number.isFinite(v)) return;
      g[gk] = g[gk] || [];
      g[gk].push(v);
    });
    const out = {};
    Object.keys(g).forEach((k) => {
      const arr = g[k];
      const n = arr.length;
      const mean = arr.reduce((a, b) => a + b, 0) / (n || 1);
      const sd = Math.sqrt(arr.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1 || 1));
      out[k] = { n, mean, sd };
    });
    stats.groups = { target, groupBy, groups: out };
  }

  if ((task === 'association' || task === 'auto') && categoricalCols.length >= 2) {
    const a = categoricalCols[0], b = categoricalCols[1];
    const levelsA = Array.from(new Set(rows.map((r) => String(r[a] ?? ''))));
    const levelsB = Array.from(new Set(rows.map((r) => String(r[b] ?? ''))));
    const table = levelsA.map(() => levelsB.map(() => 0));
    rows.forEach((r) => {
      const ia = levelsA.indexOf(String(r[a] ?? ''));
      const ib = levelsB.indexOf(String(r[b] ?? ''));
      if (ia >= 0 && ib >= 0) table[ia][ib] += 1;
    });
    const rowTotals = table.map((row) => row.reduce((s, v) => s + v, 0));
    const colTotals = levelsB.map((_, j) => table.reduce((s, row) => s + row[j], 0));
    const grand = rowTotals.reduce((s, v) => s + v, 0);
    let chi = 0;
    table.forEach((row, i) => {
      row.forEach((obs, j) => {
        const exp = (rowTotals[i] * colTotals[j]) / (grand || 1);
        if (exp > 0) chi += (obs - exp) ** 2 / exp;
      });
    });
    stats.chiSquare = { a, b, chi2: chi, df: (levelsA.length - 1) * (levelsB.length - 1) };
  }

  return { ok: true, stats };
}

/* CSV parsing (simple). */
function parseCSV(text) {
  const lines = text.replace(/\r/g, '').split('\n');
  if (!lines.length) return { columns: {}, rows: [] };
  const headers = (lines.shift() || '').split(',').map((h) => h.trim());
  const rows = lines.filter(Boolean).map((ln) => {
    const cells = ln.split(','); // simple; quotes not handled
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (cells[i] ?? '').trim(); });
    return obj;
  });
  const columns = {};
  headers.forEach((h) => {
    const sample = rows.map((r) => r[h]).slice(0, 100);
    let numericCount = 0, total = 0;
    sample.forEach((v) => {
      if (v === '' || v === null) return;
      total++;
      if (!Number.isNaN(Number(v))) numericCount++;
    });
    const type = total > 0 && numericCount / total > 0.8 ? 'numeric' : 'categorical';
    columns[h] = { name: h, type };
  });
  return { columns, rows };
}

const ToolPill = ({ icon, label }) => (
  <span className={styles.toolPill}><i className={icon} /> {label}</span>
);

const Statistics = () => {
  const { adminSettings } = useAdminSettings();
  const navigate = useNavigate();
  const [provider] = useState('local-js'); // placeholder for future providers

  const [dataset, setDataset] = useState({ columns: {}, rows: [] });
  const [fileName, setFileName] = useState('');
  const [goal, setGoal] = useState('describe');
  const [targetCol, setTargetCol] = useState('');
  const [groupCol, setGroupCol] = useState('');
  const [result, setResult] = useState(null);
  const [plan, setPlan] = useState([]);

  const cols = useMemo(() => Object.keys(dataset.columns), [dataset]);
  const numericCols = useMemo(() => cols.filter((c) => dataset.columns[c]?.type === 'numeric'), [cols, dataset]);
  const categoricalCols = useMemo(() => cols.filter((c) => dataset.columns[c]?.type === 'categorical'), [cols, dataset]);

  const recommend = useMemo(() => {
    if (goal === 'describe') return ['Summary Statistics', 'Histograms', 'Box Plots', 'Pareto (if defects)'];
    if (goal === 'compare') return ['Two-sample t-test / ANOVA', 'Levene’s Test', 'Effect Size', 'Visual: Box/Violin'];
    if (goal === 'association') return ['Correlation / Regression (num-num)', 'Chi-square (cat-cat)', 'Scatter / Heatmap'];
    if (goal === 'predict') return ['Linear/Logistic Regression', 'Train/Test Split', 'Residuals/ROC'];
    return [];
  }, [goal]);

  const onFiles = async (files) => {
    const f = files?.[0];
    if (!f) return;
    setFileName(f.name);
    if (!/\.csv$/i.test(f.name)) {
      alert('Please upload a CSV file for now. XLSX support is planned.');
      return;
    }
    const text = await f.text();
    const parsed = parseCSV(text);
    setDataset(parsed);
    setTargetCol('');
    setGroupCol('');
    setResult(null);
    setPlan([]);
  };

  const generatePlan = () => {
    const steps = [];
    if (goal === 'describe') {
      steps.push('Profile columns & data quality');
      steps.push('Compute summary stats for numeric features');
      steps.push('Frequency tables for categorical features');
    }
    if (goal === 'compare') {
      steps.push('Validate target numeric and grouping categorical');
      steps.push('Check group sizes & variance homogeneity');
      steps.push('Perform t-test (2 groups) or ANOVA (3+)');
      steps.push('Compute effect size and visualize');
    }
    if (goal === 'association') {
      steps.push('Compute Pearson correlations for numeric pairs');
      steps.push('Build contingency and chi-square for categorical pairs');
      steps.push('Visualize correlations');
    }
    if (goal === 'predict') {
      steps.push('Split data into train/test');
      steps.push('Fit baseline model and evaluate');
      steps.push('Inspect residuals / diagnostics');
    }
    setPlan(steps);
  };

  const runAnalysis = () => {
    const taskMap = { describe: 'describe', compare: 'compare', association: 'association', predict: 'auto' };
    const payload = { task: taskMap[goal] || 'auto', data: dataset, options: { targetCol, groupCol } };
    const res = analyzeLocal(payload);
    setResult(res);
  };

  const exportPlan = () => {
    const json = JSON.stringify({ goal, provider, plan, fileName, columns: dataset.columns }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Statistics_Plan_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSummaryCSV = () => {
    if (!result?.stats) return;
    const parts = [];

    if (result.stats.describe && Object.keys(result.stats.describe).length) {
      parts.push('--- Summary (numeric) ---');
      parts.push('Column,N,Mean,SD,Min,Max');
      Object.entries(result.stats.describe).forEach(([k, v]) => {
        parts.push(`${k},${v.n},${v.mean},${v.sd},${v.min},${v.max}`);
      });
    }

    if (result.stats.freq && Object.keys(result.stats.freq).length) {
      parts.push('--- Frequencies (categorical) ---');
      Object.entries(result.stats.freq).forEach(([k, arr]) => {
        parts.push(`Column: ${k}`);
        parts.push('Level,Count');
        arr.forEach((r) => parts.push(`${r.level},${r.count}`));
      });
    }

    if (result.stats.groups && Object.keys(result.stats.groups.groups || {}).length) {
      const g = result.stats.groups;
      parts.push('--- Group Summary ---');
      parts.push(`Target,${g.target}`);
      parts.push(`Group By,${g.groupBy}`);
      parts.push('Group,N,Mean,SD');
      Object.entries(g.groups).forEach(([lvl, v]) => {
        parts.push(`${lvl},${v.n},${v.mean},${v.sd}`);
      });
    }

    if (Array.isArray(result.stats.correlations) && result.stats.correlations.length) {
      parts.push('--- Correlations (numeric pairs) ---');
      parts.push('A,B,r');
      result.stats.correlations.forEach((c) => parts.push(`${c.a},${c.b},${c.r}`));
    }

    if (result.stats.chiSquare) {
      const { a, b, chi2, df } = result.stats.chiSquare;
      parts.push('--- Chi-Square (categorical pairs) ---');
      parts.push('A,B,Chi2,df');
      parts.push(`${a},${b},${chi2},${df}`);
    }

    const blob = new Blob([parts.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Statistics_Summary_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasData = cols.length > 0;

  return (
    <ResourcePageWrapper pageName="Statistics" toolName="Statistical Analysis" adminSettings={adminSettings}>
      <div className={styles.statsPage}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Statistical Analysis Workspace</h1>
            <div className={styles.subtitle}>
              <span>Guided analysis—upload data and let the assistant recommend the right tools.</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnGhost} onClick={() => navigate('/ops/lss')}>
              <i className="fas fa-th" /> LSS Dashboard
            </button>
            <button className={styles.btnSecondary} onClick={exportPlan}>
              <i className="fas fa-download" /> Export Plan
            </button>
            <button className={styles.btnPrimary} onClick={exportSummaryCSV} disabled={!result}>
              <i className="fas fa-file-csv" /> Export Summary
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className={styles.grid}>
          {/* Left: Data */}
          <div className={styles.col}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3><i className="fas fa-file-upload" /> Data Upload</h3>
                <div className={styles.hint}>CSV only for now. XLSX coming soon.</div>
              </div>
              <div
                className={styles.dropzone}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
              >
                <i className="fas fa-cloud-upload-alt" />
                <p>Drag & drop CSV here or</p>
                <label className={styles.linkLike}>
                  browse<input type="file" accept=".csv" onChange={(e) => onFiles(e.target.files)} hidden />
                </label>
                {fileName && <div className={styles.fileName}><i className="fas fa-file" /> {fileName}</div>}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3><i className="fas fa-database" /> Dataset Preview</h3>
                {hasData ? <div className={styles.badge}>{dataset.rows.length} rows</div> : null}
              </div>
              {!hasData ? (
                <div className={styles.empty}>Upload a dataset to begin.</div>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {cols.map((c) => (
                          <th key={c}>
                            <div className={styles.colHead}>
                              <span>{c}</span>
                              <span className={`${styles.typePill} ${dataset.columns[c].type === 'numeric' ? styles.num : styles.cat}`}>
                                {dataset.columns[c].type}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.rows.slice(0, 50).map((r, i) => (
                        <tr key={i}>
                          {cols.map((c) => <td key={c}>{String(r[c] ?? '')}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right: Guide */}
          <div className={styles.col}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3><i className="fas fa-magic" /> Analysis Guide</h3>
                <div className={styles.hint}>Assistant picks tools based on your goal and data types.</div>
              </div>

              <div className={styles.formRow}>
                <label>Goal</label>
                <select value={goal} onChange={(e) => setGoal(e.target.value)} className={styles.input}>
                  <option value="describe">Describe / Summarize</option>
                  <option value="compare">Compare Groups</option>
                  <option value="association">Association / Relationships</option>
                  <option value="predict">Predictive (beta)</option>
                </select>
              </div>

              {goal === 'compare' && (
                <>
                  <div className={styles.formRow}>
                    <label>Target (numeric)</label>
                    <select className={styles.input} value={targetCol} onChange={(e) => setTargetCol(e.target.value)}>
                      <option value="" disabled>Select column</option>
                      {numericCols.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className={styles.formRow}>
                    <label>Group By (categorical)</label>
                    <select className={styles.input} value={groupCol} onChange={(e) => setGroupCol(e.target.value)}>
                      <option value="" disabled>Select column</option>
                      {categoricalCols.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </>
              )}

              <div className={styles.recoRow}>
                <div className={styles.recoLabel}>Recommended Tools:</div>
                <div className={styles.recoPills}>
                  {recommend.map((r) => <ToolPill key={r} icon="fas fa-check" label={r} />)}
                </div>
              </div>

              <div className={styles.actionsRow}>
                <button className={styles.btnSecondary} onClick={generatePlan} disabled={!hasData}>
                  <i className="fas fa-list-ul" /> Generate Plan
                </button>
                <button className={styles.btnPrimary} onClick={runAnalysis} disabled={!hasData || (goal === 'compare' && (!targetCol || !groupCol))}>
                  <i className="fas fa-play" /> Run Now (beta)
                </button>
              </div>

              {plan.length > 0 && (
                <div className={styles.planBox}>
                  <div className={styles.planHeader}><i className="fas fa-route" /> Proposed Steps</div>
                  <ol className={styles.planList}>
                    {plan.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </div>
              )}
            </div>

            {/* Results */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3><i className="fas fa-poll" /> Results</h3>
              </div>

              {!result ? (
                <div className={styles.empty}>No results yet. Generate a plan or run analysis.</div>
              ) : (
                <div className={styles.results}>
                  {/* Summary */}
                  {result.stats.describe && Object.keys(result.stats.describe).length > 0 && (
                    <div className={styles.block}>
                      <div className={styles.blockTitle}>Summary Statistics</div>
                      <div className={styles.tableWrap}>
                        <table className={styles.table}>
                          <thead>
                            <tr><th>Column</th><th>N</th><th>Mean</th><th>SD</th><th>Min</th><th>Max</th></tr>
                          </thead>
                          <tbody>
                            {Object.entries(result.stats.describe).map(([k, v]) => (
                              <tr key={k}>
                                <td>{k}</td>
                                <td>{v.n}</td>
                                <td>{v.mean.toFixed(4)}</td>
                                <td>{v.sd.toFixed(4)}</td>
                                <td>{v.min}</td>
                                <td>{v.max}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Frequencies */}
                  {result.stats.freq && Object.keys(result.stats.freq).length > 0 && (
                    <div className={styles.block}>
                      <div className={styles.blockTitle}>Frequencies</div>
                      {Object.entries(result.stats.freq).map(([col, arr]) => (
                        <div key={col} className={styles.freqWrap}>
                          <div className={styles.freqHeader}>{col}</div>
                          <div className={styles.freqList}>
                            {arr.map((r, i) => (
                              <div key={i} className={styles.freqItem}>
                                <div className={styles.freqBar}>
                                  <div className={styles.freqFill} style={{ width: `${(r.count / Math.max(...arr.map(x => x.count))) * 100}%` }} />
                                </div>
                                <div className={styles.freqLabel}>{r.level || '—'} <span className={styles.mono}>{r.count}</span></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Group Summary */}
                  {result.stats.groups && Object.keys(result.stats.groups.groups || {}).length > 0 && (
                    <div className={styles.block}>
                      <div className={styles.blockTitle}>Group Comparison</div>
                      <div className={styles.tableWrap}>
                        <table className={styles.table}>
                          <thead>
                            <tr><th>Group</th><th>N</th><th>Mean</th><th>SD</th></tr>
                          </thead>
                          <tbody>
                            {Object.entries(result.stats.groups.groups).map(([k, v]) => (
                              <tr key={k}>
                                <td>{k}</td>
                                <td>{v.n}</td>
                                <td>{v.mean.toFixed(4)}</td>
                                <td>{v.sd.toFixed(4)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className={styles.hint}>For inferential tests (p-values), connect a provider in the engine.</div>
                    </div>
                  )}

                  {/* Correlations */}
                  {Array.isArray(result.stats.correlations) && result.stats.correlations.length > 0 && (
                    <div className={styles.block}>
                      <div className={styles.blockTitle}>Correlations</div>
                      <div className={styles.tableWrap}>
                        <table className={styles.table}>
                          <thead><tr><th>A</th><th>B</th><th>r</th></tr></thead>
                          <tbody>
                            {result.stats.correlations.map((c, i) => (
                              <tr key={i}><td>{c.a}</td><td>{c.b}</td><td>{c.r.toFixed(4)}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Chi Square */}
                  {result.stats.chiSquare && (
                    <div className={styles.block}>
                      <div className={styles.blockTitle}>Chi-Square (categorical association)</div>
                      <div className={styles.tableWrap}>
                        <table className={styles.table}>
                          <thead><tr><th>A</th><th>B</th><th>Chi²</th><th>df</th></tr></thead>
                          <tbody>
                            <tr>
                              <td>{result.stats.chiSquare.a}</td>
                              <td>{result.stats.chiSquare.b}</td>
                              <td>{result.stats.chiSquare.chi2.toFixed(4)}</td>
                              <td>{result.stats.chiSquare.df}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className={styles.hint}>Significance requires p-value. Add a backend provider to compute it.</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ResourcePageWrapper>
  );
};

export default Statistics;
