# JupyterHub Setup Guide

## Pre-Requisites

Before setting up JupyterHub, ensure the following requirements are met:

1.  **RACF Setup**:

    - Properly configured RACF keyring and certificate for secure JupyterHub access
    - Dataset created for CSR using ISPF
    - User ID with appropriate permissions to manage RACF resources

2.  **Surrogate Setup**:

    The user that controls the JupyterHub instance needs to be able to switch to the the users which are using the JupyterHub instance. For the same, the surrogate permissions for these users should be provided to the JupyterHub server owner.

    This is required because JupyterHub spawns each user's single-user server **as the target user** (the spawner switches to that user's UID before starting the server process), so the hub owner must be permitted to surrogate into every end user.

    To do so, the commands are listed below (note that `access_userid` refers to the users of the JupyterHub instance and the `owner_userid` refers to the user that controls the JupyterHub instance):

    ```bash
    tsocmd "RDEF SURROGAT BPX.SRV.<access_userid> UACC(NONE) OWNER(<access_userid>) NOTIFY(<access_userid>)"
    tsocmd "PE BPX.SRV.<access_userid> CLASS(SURROGAT) ID(<owner_userid>) ACC(READ)"
    ```

    If `SURROGAT` class is `RACLIST`ed, you will need to `REFRESH` the class:

    ```bash
    tsocmd "SETR REFRESH RACLIST(SURROGAT)"
    ```

    List the profile:

    ```bash
    tsocmd "RL SURROGAT BPX.SRV.<access_userid> ALL"
    ```

3.  **JupyterHub Requirements**:

    - Python 3.1x environment configured for JupyterHub
    - Requirements installed using the following requirement spec (save to a file `jupyterhub_requirements.txt` and install using the command `pip install -r jupyterhub_requirements.txt`):
      ```
      jupyter_client
      jupyter_core
      jupyter-events
      jupyter-lsp
      jupyter_server
      jupyter_server_terminals
      jupyter-telemetry
      jupyterhub-nativeauthenticator
      jupyterhub
      ipykernel
      jupyterlab
      jupyterlab_server
      babel
      packaging>=25.0
      bleach
      pandocfilters
      ```

## Setting up Virtual Environment

To set up a virtual environment for JupyterHub build and usage:

1. Create the virtual environment using the specific Python path:

   ```bash
   <path-to-python3.1x> -m venv jupyterhub_venv --system-site-packages
   ```

2. Activate the virtual environment:

   ```bash
   source jupyterhub_venv/bin/activate
   ```

3. Verify the Python interpreter being used:

   ```bash
   type python
   ```

4. Install the dependencies using the following commands (content of the requirements file is provided above):

   ```bash
   pip install -r jupyterhub_requirements.txt
   ```

5. Install JupyterHub using the following command:

   ```bash
   pip install jupyterhub==4.1.6.post0
   ```

## Setting up Node.js and npm

To configure Node.js and npm for JupyterHub:

1. Add Node.js to the PATH:

   ```bash
   export PATH="<PATH_TO_NODEJS_BIN>:${PATH}"
   ```

2. Configure npm to use local global directory:

   ```bash
   mkdir -p $HOME/.local-npm-global
   npm config set prefix "$HOME/.local-npm-global"
   export PATH="$HOME/.local-npm-global/bin:$PATH"
   ```

3. Install configurable-http-proxy:
   ```bash
   npm install -g configurable-http-proxy
   ```

## Configuring the RACF Keyring and Certificate

Before modifying keyring(s) and generating certificates, make sure that you have access to read the keyring with the commands below:

```bash
tsocmd "PERMIT IRR.DIGTCERT.LISTRING CLASS(FACILITY) ID(<your_userid>) ACCESS(READ)"
tsocmd "SETROPTS RACLIST(FACILITY) REFRESH"
```

To configure the RACF keyring and certificate for secure JupyterHub access:

1. Create the keyring:

   ```bash
   tsocmd "RACDCERT ID(<your_userid>) ADDRING(<keyring_name>)"
   ```

2. Create the certificate:

   ```bash
   tsocmd "RACDCERT ID(<your_userid>) GENCERT SUBJECTSDN(CN('<your_hostname>') O('<your_organization>') OU('<your_userid> z/OS') L('<your_location>') SP('<your_state>') C('<your_country>')) SIZE(2048) WITHLABEL('2048 bit cert <your_hostname> <your_userid>')"
   ```

3. Create the CSR - certificate signing request:

   ```bash
   # Prerequisite: create the dataset from ISPF
   tsocmd "RACDCERT ID(<your_userid>) GENREQ(LABEL('2048 bit cert <your_hostname> <your_userid>')) DSN('<dataset_name>')"
   ```

4. List keyring information:

   ```bash
   tsocmd "RACDCERT ID(<your_userid>) LISTRING(<keyring_name>)"
   ```

5. Add the certificate to the keyring:

   ```bash
   tsocmd "RACDCERT ID(<your_userid>) CONNECT(ID(<your_userid>) LABEL('2048 bit cert <your_hostname> <your_userid>') RING(<keyring_name>) DEFAULT)"
   ```

6. List the certificate to verify:

   ```bash
   tsocmd "RACDCERT ID(<your_userid>) LIST(LABEL('2048 bit cert <your_hostname> <your_userid>'))"
   ```

7. List keyring information to verify:

   ```bash
   tsocmd "RACDCERT ID(<your_userid>) LISTRING(<keyring_name>)"
   ```

Note: RACF configuration requires appropriate system permissions and Z/OS administration access.

## Configuring JupyterHub

To configure JupyterHub:

1. Edit the configuration file (jupyterhub_config.py) with the minimal required configuration:

   ```python
   import os
   import nativeauthenticator

   c = get_config()

   # ---- Authenticator ----
   # NativeAuthenticator manages its own user list: passwords are bcrypt-hashed and
   # stored in JupyterHub's database. It does NOT authenticate directly against
   # SAF/RACF. z/OS security is still involved at two other layers:
   #   - the Hub uses a SAF keyring for TLS termination (see saf_* options below),
   #   - the spawner runs each single-user server as the target user via surrogate
   #     permissions (see "Surrogate Setup" above).
   c.JupyterHub.authenticator_class = 'nativeauthenticator.nativeauthenticator.NativeAuthenticator'
   # The shorter entry point 'native' also works:
   # c.JupyterHub.authenticator_class = 'native'

   # ---- Ports (not fixed; any available ports work) ----
   c.JupyterHub.bind_url = 'http://0.0.0.0:8010'
   c.JupyterHub.cleanup_proxy = True   # shutdown proxy on Hub shutdown
   c.JupyterHub.cleanup_servers = True # shutdown single-user servers on Hub shutdown
   c.ConfigurableHTTPProxy.api_url = 'http://0.0.0.0:8011'
   c.JupyterHub.hub_bind_url = 'http://0.0.0.0:8012'
   c.JupyterHub.hub_connect_url = 'http://0.0.0.0:8012'

   # ---- Admin user ----
   c.Authenticator.admin_users = {'<your_userid>'}

   # ---- SAF keyring for TLS (the three MUST be specified together) ----
   # Each value is base64-encoded. Used by the proxy to terminate TLS via libsaf.
   c.JupyterHub.saf_keyring = "<base64_encoded_saf_keyring>"
   c.JupyterHub.saf_cert = "<base64_encoded_saf_certificate_label>"
   c.JupyterHub.saf_userid = "<base64_encoded_saf_userid>"

   # ---- Spawner ----
   # Uncomment and set to the subdirectory under the user's home folder that the
   # single-user server should start in. {username} is substituted at spawn time.
   # c.Spawner.notebook_dir = '/u/{username}/custom_notebook_dir'

   # ---- ConfigurableHTTPProxy secure defaults ----
   c.ConfigurableHTTPProxy.command = [
       'configurable-http-proxy',
       '--ssl-protocol', 'TLSv1_2',
       '--ssl-ciphers', 'ECDHE+AESGCM:ECDHE+CHACHA20:!aNULL:!eNULL:!MD5:!DSS:!RC4:!3DES',
   ]

   # ---- NativeAuthenticator secure defaults ----
   c.NativeAuthenticator.check_common_password = True
   c.NativeAuthenticator.minimum_password_length = 12
   c.NativeAuthenticator.check_password_contains_username = True
   c.NativeAuthenticator.required_password_character_classes = ["lowercase", "uppercase", "digits", "symbols"]
   c.NativeAuthenticator.allowed_username_character_classes = ["letters", "digits"]
   c.NativeAuthenticator.allowed_failed_logins = 5
   c.NativeAuthenticator.seconds_before_next_try = 3600
   ```

   > **HTTPS is effectively mandatory.** By default the Hub sets secure cookies
   > (`SameSite=None; Secure=True`) and marks XSRF cookies `secure`, so a browser
   > will not send login cookies over plain HTTP. Serve the Hub over HTTPS (via the
   > SAF keyring above, or `ssl_cert`/`ssl_key`, or an `https://` bind_url). The
   > `0.0.0.0` ports shown above are for illustration only.

2. Start JupyterHub:
   ```bash
   jupyterhub --config [PATH_TO_CONFIG.PY_FILE]
   ```

## NativeAuthenticator Configuration

NativeAuthenticator (package `jupyterhub-nativeauthenticator`, version `1.3.0`) keeps its user accounts and bcrypt-hashed passwords inside JupyterHub's own database. It is a good fit when you want sign-up / password management built into JupyterHub rather than delegating to an external identity store.

All of the following are configurable traits. Defaults are shown.

### Sign-up and authorization

- **`enable_signup`** (`Bool`, default `True`): Allow new account registration. When `False` the signup page returns 404.
- **`open_signup`** (`Bool`, default `False`): Skip admin approval — new sign-ups are authorized automatically.
- **`ask_email_on_signup`** (`Bool`, default `False`): Collect an email address on the signup form.
- **`tos`** (`Unicode`, default `None`): HTML shown beside the Terms-of-Service checkbox.

A user listed in `admin_users` (or `allowed_users`) is auto-authorized on sign-up. A new account is created **only** when the two entered passwords match (and captcha, if configured, passes).

### Password strength

- **`minimum_password_length`** (`Integer`, default `1`): Minimum password length on sign-up.
- **`check_common_password`** (`Bool`, default `False`): Reject the top-10000 common passwords (list bundled as `common-credentials.txt`).
- **`check_password_contains_username`** (`Bool`, default `False`): Reject passwords that contain the username (applies to sign-up and password change).
- **`required_password_character_classes`** (`List[Unicode]`, default `[]`): Require these character classes. Valid values: `lowercase`, `uppercase`, `digits`, `symbols`. Empty = no class requirement.

### Username validation

- **`allowed_username_character_classes`** (`List[Unicode]`, default `[]`): Restrict allowed username characters to these classes. Valid values: `letters`, `digits`, `symbols`. Empty = allow all characters except comma, space, and `/`.

### Failed-login lockout

- **`allowed_failed_logins`** (`Integer`, default `0`): Failed attempts before the account is blocked. `0` = never block.
- **`seconds_before_next_try`** (`Integer`, default `600`): How long (seconds) a blocked account must wait before the next attempt.

### Other

- **`import_from_firstuse`** (`Bool`, default `False`): Import users from a FirstUseAuthenticator dbm on start.
- **`firstuse_db_path`** (`Unicode`, default `"passwords.dbm"`): Path to the FirstUse dbm. *(Use the trait name `firstuse_db_path`; do **not** use `firstuse_dbm_path` — that name appears in some docs but does not take effect.)*
- **`delete_firstuse_db_after_import`** (`Bool`, default `False`): Remove the FirstUse dbm after importing.
- **`allow_2fa`** (`Bool`, default `False`): Enable TOTP two-factor authentication (`onetimepass`).

## Spawner Options (z/OS)

The `LocalProcessSpawner` exposes several z/OS-specific traits:

- **`notebook_dir`** (`Unicode`): Default directory the single-user server starts in. `{username}` is substituted. The user's home directory is created automatically (after authentication, as the target user) if it does not exist.
- **`starting_port`** (`Integer`, default `0`): First port to allocate for a single-user server. `0` = random. When `>0`, ports are allocated from `starting_port` upward, up to `starting_port + max_users`.
- **`max_users`** (`Integer`, default `0`): Maximum number of users (upper bound for the port range above). `0` = no limit.
- **`global_notebook_config_dir`** (`Unicode`, default `''`): Path to a global `jupyter_notebook_config.py` applied to every spawned server.
- **`cleanup_notebook_dir_on_delete`** (`Bool`, default `False`): Permanently delete a user's notebook directory when the user is deleted (via `delete_forever`). Has safety guards (refuses `/`, the home directory, symlinks, or empty paths). **Use with caution — this destroys user data.**

## Security enhancements over opensource JupyterHub

### HTTPS is the recommended posture

Serve the Hub over HTTPS using a SAF keyring (see `saf_keyring` / `saf_cert` / `saf_userid`), or `ssl_cert`/`ssl_key`, or an `https://` `bind_url`. Secure cookies, XSRF protection, and HSTS all depend on HTTPS.

### Secure cookies and XSRF (on by default)

- Cookies are set with `SameSite=None; Secure=True` by default, so login only works over HTTPS.
- XSRF cookies get the `secure` flag automatically when the request is HTTPS.
- `X-Content-Type-Options: nosniff` is sent on all responses (base, static, and logo handlers) and cannot be turned off.
- `Content-Security-Policy: frame-ancestors 'none'` prevents the Hub from being framed.

### User-enumeration hardening

Failed user lookups return a bare `HTTPError(404)` instead of leaking "No such user: X", and resource-specific authorization failures return 404 rather than 403, making it harder to probe which usernames exist.

### HTTP Strict Transport Security (HSTS)

HTTP Strict Transport Security (HSTS) tells browsers to always use HTTPS for your JupyterHub domain, preventing downgrade attacks.

> **HSTS only takes effect over HTTPS.** The header is emitted only when HTTPS is detected — i.e. when `ssl_cert`+`ssl_key` are set, **or** `saf_cert`+`saf_keyring` are set, **or** `bind_url` starts with `https://`. If you enable HSTS without HTTPS, the Hub logs a warning and emits no header.

#### Enabling HSTS

To enable HSTS, add the following to your `jupyterhub_config.py`:

```python
# Enable HSTS
c.JupyterHub.hsts = True

# Optional: Customize HSTS settings
c.JupyterHub.hsts_max_age = 63072000  # 2 years in seconds (default)
c.JupyterHub.hsts_include_subdomains = True  # Apply to subdomains (default)
c.JupyterHub.hsts_preload = False  # Submit to browser preload list (optional)
```

Or use command-line options:

```bash
jupyterhub --hsts --hsts-max-age=63072000 --hsts-include-subdomains
```

> **Caution:** `hsts_include_subdomains` defaults to `True`. Only enable HSTS if **all** subdomains of the hub's host are served over HTTPS, otherwise they will become unreachable.

### HSTS Configuration Options

- **`hsts`**: Enable/disable HSTS (default: `False`)
- **`hsts_max_age`**: How long browsers should remember HSTS policy in seconds (default: `63072000` = 2 years)
- **`hsts_include_subdomains`**: Apply HSTS policy to all subdomains (default: `True`)
- **`hsts_preload`**: Allow submission to browser preload lists (default: `False`)

### SAF keyring / certificate (TLS termination)

The `saf_keyring`, `saf_cert`, and `saf_userid` options are **base64-encoded** and **must be specified together**. The proxy uses the bundled `libsaf.so` to extract the certificate and private key from the SAF keyring, decrypts the key, and passes `--ssl-key` / `--ssl-cert` to the configurable-http-proxy. This is the SAF/RACF integration point for TLS — authentication of *users* is handled by the configured authenticator (NativeAuthenticator by default).