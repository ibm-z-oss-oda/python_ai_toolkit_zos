# Package Installations and Virtual Environments
Python allows for deployments that can be closely configured to the needs of a 
particular application or developer.  Programming language environments usually 
provide runtime libraries and the means to compile and link executable applications. 
Users then configure their environment settings to point to the proper libraries 
for their applications. 

Python also enables the arbitrary grouping of built packages into tailored runtime 
environments that can support one or more applications and users.  This is 
accomplished through the use of _virtual environments_.

_**Important**_  
This explanation provides details about where both the Python AI Toolkit and the 
[IBM Open Enterprise SDK for Python](https://www.ibm.com/products/open-enterprise-python-zos) 
(the Python interpreter) for z/OS are installed, but it's important to keep the 
two separate.  These products are closely related, but it's much easier to service 
and maintain each if they are installed at different locations.

## Python Installations and Virtual Environments
There are 3 different locations where Python and associated Python packages may be 
installed, and each serves different sets of users and applications.

### The System Installation
The _**IBM Open Enterprise SDK for Python**_ is a pre-requisite for the 
_**Python AI Toolkit for IBM z/OS**_, and it contains two key components - the 
Python language interpreter, and the Python Standard Library.  This is the 
foundation needed to create and run Python applications.  The Python AI Toolkit 
can be thought of as an extended library of Python packages that supplements the 
standard library of the SDK for users to create AI applications.

This SDK is installed at a shared location in the z/OS Unix file system - usually 
```/usr/lpp/IBM/cyp```.  Under this directory is a sub-directory for each installed 
Python version, like 3.11 (v3r11) or 3.12 (v3r12).  The SDK contains a small collection
of additional packages like the pip package manager in a sub-directory named 
```site-packages```.  For example, the full path to ```site-packages``` for a Python 3.12 
installation will generally be ```/usr/lpp/IBM/cyp/v3r12/pyz/lib/python3.12/site-packages```.

This ```site-packages``` sub-directory is important because this is where new packages
are installed by the pip package manager.  The other locations where packages 
can be installed also contain sub-directories with this name.

Please note that the system installation location is mentioned here to provide context
for the explanation of local installations and virtual environments.  As noted in the 
introduction, we recommend against installing packages in the ```site-packages``` of
the system installation (SDK).

### The Local Installation
Regular users may install python packages themselves, although they obviously won't 
have permission to install to the system installation.  Any package installs performed 
by regular users will result in the package being installed under 
```$HOME/.local/lib/python3.xx/site-packages```.  In this way, users may install 
packages they need for their specific needs, including different versions of 
packages that may be installed at the system level.  This allows users to tailor 
the Python runtime to their particular needs.

The set of packages that end users are allowed to install themselves can be 
managed through policy and configuration.  The best practices for accomplishing this
are beyond the scope of this document.  The key point here is that when users 
install packages themselves, those packages are located under their home directory.

### Virtual Environments
Applications created by developers often have unique dependencies on particular 
sets of packages at specific versions.  While the users who run these applications 
have the capability to create their own local package installation, it's often 
not feasible for them to have a single local install that meets the needs of 
every application they might run.  

Virtual environments are a means for users to create separate package installations, 
each tailored to the needs of one or more different Python applications.  They are
similar in structure to a user's local installation, and can be assigned a name 
when created.  Here is an example of how to create and use a virtual environment:

```
> python3 -m venv xmp_venv
> source xmp_venv/bin/activate 
(xmp_venv) > pip list
Package Version
------- -------
pip     23.3.2
(xmp_venv) [bash] /u/bostian> pip install numpy pandas
Looking in indexes: https://downloads.pyaitoolkit.ibm.net/repository/python_ai_toolkit_zos/simple
Collecting numpy
  Downloading https://downloads.pyaitoolkit.ibm.net/repository/python_ai_toolkit_zos/packages/numpy/1.26.0/numpy-1.26.0-cp312-none-any.whl (38.8 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 38.8/38.8 MB 11.9 MB/s eta 0:00:00
Collecting pandas
  Downloading https://downloads.pyaitoolkit.ibm.net/repository/python_ai_toolkit_zos/packages/pandas/1.5.1.post3/pandas-1.5.1.post3-cp312-none-any.whl (32.0 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 32.0/32.0 MB 14.2 MB/s eta 0:00:00
Collecting python-dateutil>=2.8.1 (from pandas)
  Downloading https://downloads.pyaitoolkit.ibm.net/repository/python_ai_toolkit_zos/packages/python-dateutil/2.8.2/python_dateutil-2.8.2-py2.py3-none-any.whl (247 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 247.7/247.7 kB 12.0 MB/s eta 0:00:00
Collecting pytz>=2020.1 (from pandas)
  Downloading https://downloads.pyaitoolkit.ibm.net/repository/python_ai_toolkit_zos/packages/pytz/2022.4/pytz-2022.4-py2.py3-none-any.whl (500 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 500.8/500.8 kB 26.0 MB/s eta 0:00:00
Collecting defusedxml (from pandas)
  Downloading https://downloads.pyaitoolkit.ibm.net/repository/python_ai_toolkit_zos/packages/defusedxml/0.7.1.post3/defusedxml-0.7.1.post3-py2.py3-none-any.whl (28 kB)
Collecting six>=1.5 (from python-dateutil>=2.8.1->pandas)
  Downloading https://downloads.pyaitoolkit.ibm.net/repository/python_ai_toolkit_zos/packages/six/1.16.0/six-1.16.0-py3-none-any.whl (11 kB)
Installing collected packages: pytz, six, numpy, defusedxml, python-dateutil, pandas
Successfully installed defusedxml-0.7.1.post3 numpy-1.26.0 pandas-1.5.1.post3 python-dateutil-2.8.2 pytz-2022.4 six-1.16.0
(xmp_venv) [bash] /u/bostian> pip list
Package         Version
--------------- -----------
defusedxml      0.7.1.post3
numpy           1.26.0
pandas          1.5.1.post3
pip             23.3.2
python-dateutil 2.8.2
pytz            2022.4
six             1.16.0
(xmp_venv) > deactivate
>
```
_Example 1 - creating and using a virtual environment named xmp_venv._

This example shows several things:
- Creating the virtual environment by running the python3 command to run the ```venv``` 
module.
- Activating the environment through the activate command.  Note that the active virtual 
environment name is prefixed to your command prompt.
- The first pip list command shows that the virtual environment is essentially empty, 
except for the pip command.
- Installing numpy and pandas results in those packages being added to the virtual environment, 
along with 4 additional dependency packages - defusedxml, python-dateutil, pytz, and six.  
Without the active xmp-venv environment, these would have been installed in the 
```site-packages``` under ```$HOME/.local```.
- The deactivate command returns you to the base environment.

Note that the installed packages were all pulled from the Toolkit deployment channel - 
```downloads.pyaitoolkit.ibm.net```.

Similar to the local installation, xmp-venv contains a ```site-packages``` under 
```/$HOME/xmp_venv/lib/python3.12```.

When a user is finished using a virtual environment, all they have to do is a recursive delete
(```rm -r <venv_name>```) on the root directory of the environment.  There is no global list or 
index of virtual environments that needs to be updated.

## How Installations and Virtual Environments are Related
It's necessary to have a system installation in place, and accessible through the user's 
```PATH``` and ```LIBPATH``` environment variables before creating a virtual environment. 
This is what allows you to run the ```python3 -m venv``` command.  The resulting virtual 
environment will contain symbolic links back to the system installation for many things 
like the python3 command.  This helps to save some space and keep things consistent 
across virtual environments for the same Python interpreter level.
