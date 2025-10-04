def install_cookie_hooks(app):
    from flask import request

    COOKIE_NAME   = "sekki_access"
    COOKIE_DOMAIN = ".sekki.io"  # works for api.sekki.io; set None to host-only
    COOKIE_SECURE = True
    COOKIE_SAMESITE = "None"
    COOKIE_PATH = "/"
    COOKIE_MAX_AGE = 60 * 60 * 24

    @app.before_request
    def _cookie_to_auth():
        # If Authorization is missing but cookie exists, inject a Bearer header
        if request.headers.get("Authorization"):
            return
        tok = request.cookies.get(COOKIE_NAME)
        if tok:
            request.environ["HTTP_AUTHORIZATION"] = f"Bearer {tok}"

    @app.after_request
    def _set_cookie_on_login(resp):
        try:
            if request.path.endswith("/api/auth/login") and getattr(resp, "is_json", False):
                data = resp.get_json(silent=True) or {}
                tok = data.get("token")
                if tok:
                    resp.set_cookie(
                        COOKIE_NAME, tok,
                        max_age=COOKIE_MAX_AGE,
                        httponly=True,
                        secure=COOKIE_SECURE,
                        samesite=COOKIE_SAMESITE,
                        domain=COOKIE_DOMAIN,
                        path=COOKIE_PATH,
                    )
        finally:
            return resp
