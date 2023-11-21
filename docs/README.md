# Reference Documentation for the Python AI Toolkit for IBM z/OS
The Python AI Toolkit for IBM z/OS (a.k.a "the Toolkit") is a library of packages used together with the 
[IBM Open Enterprise SDK for Python](https://www.ibm.com/products/open-enterprise-python-zos) to 
provide a runtime environment supporting AI and machine learning workloads on z/OS.  The SDK includes 
the Python interpreter and pip package manager, which are primary interfaces for interacting with the 
packages of the Toolkit.  Through these interfaces, the Toolkit provides the common Python experience 
that users from other platforms will recognize.

## Function and Operation
The primary differences between running Python on z/OS verses other platforms are operational rather 
than functional.  Python has the means to create secure environments, but there are a set of best 
practices to follow that most effectively leverage these capabilities.  z/OS is a carefully controlled 
and managed production environment where these best practices can be employed to demonstrate Python 
workloads as an essential and secure part of the enterprise.  Both open source and dedicated z/OS 
users should recognize the Python environment on this platform.

This documentation includes insights about how Python is structured, how it is managed, and how best 
to interface with z/OS through Python interfaces.  Relevant topics include:

- [Open Source Security from the Top](./security_from_the_top.md)
- [A History of Python Package Management on z/OS](./package_mgmt_history.md)
- [Python and supply chain security](./python_supply_security.md)
- [Secure access to the Toolkit](./secure_toolkit_access.md)
- [Best practices for Toolkit Deployment](./deployment_best_practices.md)
- Why virtual environments are important
- [Terminology and Reference Links](./terms_reference_links.md)