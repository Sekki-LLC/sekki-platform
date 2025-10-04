from flask import Blueprint, Response, request, stream_with_context, current_app
import os, json, anthropic

chat_stream_bp = Blueprint("chat_stream", __name__)

_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-latest")

@chat_stream_bp.route("/api/chat/stream")
def chat_stream():
    """Server-Sent Events stream for Claude text output."""
    q = (request.args.get("q") or "").strip()
    if not q:
        return Response('data: {"error":"missing q"}\n\n', mimetype="text/event-stream")

    def gen():
        try:
            with _client.messages.stream(
                model=_MODEL,
                max_tokens=1024,
                system="You are a market analyst for Sekki Market IQ.",
                messages=[{"role": "user", "content": q}],
            ) as stream:
                for event in stream:
                    txt = None
                    # Anthropic streams 'content_block_delta' for text chunks
                    if getattr(event, "type", "") == "content_block_delta":
                        txt = d = getattr(event, "delta", None); txt = getattr(d, "text", None)
                    # Some SDK versions also send 'message_delta'
                    elif getattr(event, "type", "") == "message_delta":
                        txt = d = getattr(event, "delta", None); txt = getattr(d, "text", None)
                    if txt:
                        yield f"data: {json.dumps({'text': txt})}\n\n"
                # finished
                yield "event: done\ndata: {}\n\n"
        except Exception as e:
            current_app.logger.exception("SSE failure")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    headers = {"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    return Response(stream_with_context(gen()), mimetype="text/event-stream", headers=headers)
