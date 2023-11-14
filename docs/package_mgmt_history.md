# A History of Python Package Management on z/OS
The Python AI Toolkit for IBM z/OS (a.k.a "the Toolkit") is a library of packages that are used 
together with the 
[IBM Open Enterprise SDK for Python](https://www.ibm.com/products/open-enterprise-python-zos) to 
provide a runtime environment supporting AI and machine learning workloads on z/OS.  The SDK includes 
the Python interpreter and 
[pip package manager](https://pip.pypa.io/en/stable/getting-started/), 
which are primary interfaces for interacting the packages of the Toolkit.  Through these interfaces, 
the Toolkit provides the common Python experience that users from other platforms will recognize.

z/OS system administrators manage software using 
[SMP/E (System Modification Program/Extended)](https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-smpe), 
an essential tool that serves the same purpose as pip, but in a very different way.  The Python SDK is 
a no-cost component of z/OS, so it is installed and managed using SMP/E, like the other languages 
available on the platform.

The Toolkit is an offering that logically resides at the application layer of the software stack, above 
the operating system, and needs to be used and managed in a fundamentally different way.  Pip is a 
better choice for managing Python packages than SMP/E for these reasons:
- Users often assemble Python packages into their own runtime environments called 
[virtual environments](https://docs.python.org/3/library/venv.html).  This requires them to gather 
packages at specific versions into local groupings that they can use to develop their applications, 
deploy into test environments, and isolate themselves from other users.  Pip is the mechanism used to 
manage packages within a virtual environment.  There is no equivalent function supported by the SMP/E 
tool.
- The Toolkit is not a monolithic offering, but an aggregation of more than 175 packages that continues 
to grow over time.  That means there are at least 175 upstream communities working on their code bases 
and making changes continuously.  New versions of member packages are being generated daily.  While 
it's not necessary that the Toolkit remains in instantaneous lockstep with these new versions, it does 
mean that the package management system be capable of updating individual packages rather than treating 
the Toolkit as a single entity.  SMP/E does not readily support this.
- User's don't write Python code so much as they interact with the entire Python ecosystem.  This 
ecosystem is made up of several key components:
   - A package management system with an associated package index [(pypi)](https://pypi.org/)
   - A system for requesting enhancements [(pep)](https://peps.python.org/)
   - A style guide that is often mandatory for code submissions [(pep8)](https://peps.python.org/pep-0008/)
   - A rich suite of coding assist tools that supports development and test of new code (e.g. [vscode](https://code.visualstudio.com/docs/languages/python))

   This ecosystem has been duplicated by several other open languages, like Go, Node.js, and Rust.  
   Today's generation of developers and testers have grown up with open languages that provide much 
   more than just a compiler or interpreter.  Replacing pip on z/OS with a fundamentally different 
   package manager will create a large barrier to adoption for the platform.
- We tried this already.  IBM Open Data Analytics for z/OS (IzODA) contained a Python library of over 
250 packages that was managed by SMP/E.  Over its 5 year lifespan we issued approximately 6 service 
updates to the collection of packages, and this was terribly inadequate.  It was impossible to maintain 
any version currency with the collection of packages from upstream communities who all released 
multiple new versions every year.  IzODA was deprecated in early 2023 and the Python component is being 
replaced by this Toolkit.