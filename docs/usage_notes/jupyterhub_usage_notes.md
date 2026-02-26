# JupyterHub Setup Guide

## Pre-Requisites

Before setting up JupyterHub, ensure the following requirements are met:

1.  **RACF Setup**:

    - Properly configured RACF keyring and certificate for secure JupyterHub access
    - Dataset created for CSR using ISPF
    - User ID with appropriate permissions to manage RACF resources

2.  **Surrogate Setup**:

    The user that controls the JupyterHub instance needs to be able to switch to the the users which are using the JupyterHub instance. For the same, the surrogate permissions for these users should be provided to the JupyterHub server owner.

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
   pip install jupyterhub==4.1.6
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
   c = get_config()

   # Availability of authentication methods; NativeAuthenticator is recommended to be used since it uses SAF / RACF to authenticate, as per z/OS security guidelines.
   # However, do note that the default authenticator is the DummyAuthenticator, and this default will need to be changed as per requirement.
   # Set authenticator to native - this is essential for the server to authenticate using the SAF / RACF methods
   c.JupyterHub.authenticator_class = 'nativeauthenticator.nativeauthenticator.NativeAuthenticator'

   # Note: the below mentioned ports are not fixed, it is possible to use any port as long as they are available.
   c.JupyterHub.bind_url = 'http://0.0.0.0:8010'  # Bind URL for JupyterHub
   c.JupyterHub.cleanup_proxy = True  # Cleanup proxy on shutdown
   c.JupyterHub.cleanup_servers = True  # Cleanup servers on shutdown
   c.ConfigurableHTTPProxy.api_url = 'http://0.0.0.0:8011'  # API URL for configurable proxy
   c.JupyterHub.hub_bind_url = 'http://0.0.0.0:8012'  # Hub bind URL
   c.JupyterHub.hub_connect_url = 'http://0.0.0.0:8012'  # Hub connect URL

   c.Authenticator.admin_users = {'<your_userid>'}  # Admin user for JupyterHub
   c.JupyterHub.saf_keyring = "<base64_encoded_saf_keyring>"
   c.JupyterHub.saf_cert = "<base64_encoded_saf_certificate>"
   c.JupyterHub.saf_userid = "<base64_encoded_saf_userid>"

   # Uncomment and set the below value to the subdirectory on the user folder which will be the default directory with which the Jupyterhub process will spawn
   # c.Spawner.notebook_dir = '/u/{username}/custom_notebook_dir'
   ```

2. Start JupyterHub:
   ```bash
   jupyterhub --config [PATH_TO_CONFIG.PY_FILE]
   ```

## Security enhancements over opensource JupyterHub:

### HTTP Strict Transport Security (HSTS)

HTTP Strict Transport Security (HSTS) is a security feature that tells browsers to always use HTTPS for your JupyterHub domain. This prevents downgrade attacks where an attacker tries to force connections over insecure HTTP.

#### Enabling HSTS

To enable HSTS, add the following to your `jupyterhub_config.py`:

```python
# Enable HSTS
c.JupyterHub.hsts = True

# Optional: Customize HSTS settings
c.JupyterHub.hsts_max_age = 63072000  # 2 years in seconds (default)
c.JupyterHub.hsts_include_subdomains = True  # Apply to subdomains (default)
c.JupyterHub.hsts_preload = False  # Submit to preload list (optional)
```

Or use command-line options:

```bash
jupyterhub --hsts --hsts-max-age=63072000 --hsts-include-subdomains
```

### HSTS Configuration Options

- **`hsts`**: Enable/disable HSTS (default: `False`)
- **`hsts_max_age`**: How long browsers should remember HSTS policy in seconds (default: `63072000` = 2 years)
- **`hsts_include_subdomains`**: Apply HSTS policy to all subdomains (default: `True`)
- **`hsts_preload`**: Allow submission to browser preload lists (default: `False`)