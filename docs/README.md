# Reference Documentation for the Python AI Toolkit for IBM z/OS
The Python AI Toolkit for IBM z/OS (a.k.a "the Toolkit") is a library of packages that are used 
together with the 
[IBM Open Enterprise SDK for Python](https://www.ibm.com/products/open-enterprise-python-zos) to 
provide a runtime environment supporting AI and machine learning workloads on z/OS.  The SDK includes 
the Python interpreter and pip package manager, which are primary interfaces for interacting with the 
packages of the Toolkit.  Through these interfaces, the Toolkit provides the common Python experience 
that users from other platforms will recognize.

## Function and Operation
The primary differences between running Python on z/OS verses other platforms are operational rather 
than functional.  That is, a great deal of effort has been made to make the Python runtime experience 
for end users common, while the process for deployment and management of the Toolkit aligns with z/OS 
best practices. 

This documentation includes insights about how Python is structured, how it is managed, and how best 
to interface with z/OS through Python interfaces.  Relevant topics include:

- [Open Source Security from the Top](./security_from_the_top.md)
- [A History of Python Package Management on z/OS](./package_mgmt_history.md)
- [Python and supply chain security](./python_supply_security.md)
- [Secure access to the Toolkit](./secure_toolkit_access.md)
- Best practices for Toolkit Deployment
- Why virtual environments are important
- Terminology and Reference Links