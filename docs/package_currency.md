# Package Currency Within the Python AI Toolkit
The [Python AI Toolkit for IBM z/OS](https://ibm-z-oss-oda.github.io/python_ai_toolkit_zos/) 
 (a.k.a. the Toolkit) is a federation of 230+ software packages, 
each at a specific version.  The Toolkit itself also has a version of the form 
```version.modification.fix``` to indicate the relative age of the Toolkit compared to other 
Toolkit instances.  A higher Toolkit version number (e.g. 1.1.4 vs 1.1.2) generally means the 
packages within are more current.

The currency of any individual package in the Toolkit may be affected by a number of factors. 
Porting issues sometimes prevent the latest version of a package from being provided, because 
some interface the package requires may not yet be available.  This is not a unique problem 
for z/OS.  For example, some Python packages only build on certain Linux distributions.  While 
we usually resolve these issues, they can delay our delivery of a given package at the latest 
version.

Sometimes we have to maintain a prior version of a package because something else depends on 
it at a specific version.  Usually when this is the case, we will maintain multiple versions 
of the package until the dependency on the older version is upgraded and resolved.  At this 
point, we will prune the old version, and maintain the more current one.

All versions of the Toolkit support the same set of Python interpreters that the 
[IBM Open Enterprise SDK for Python](https://www.ibm.com/products/open-enterprise-python-zos)  provides.  We publish and maintain package sets for all the current 
interpreters.  At the moment, this includes Python 3.10, 3.11, and 3.12.  About 85% of the 
packages in the Toolkit can run on any Python 3 interpreter, so there is one common package 
wheel provided for each supported interpreter.  The remaining 15% of package wheels are 
built specifically for a given Python version, and there is a unique wheel instance for 
each of these (currently cp310, cp311, and cp312).  In those cases, the supported package 
version may be different for one interpreter level compared to another.  We provide the 
latest versions of these interpreter-specific packages that build successfully on z/OS.

The key mechanism that drives currency for the member packages of the Toolkit is security.  
This is also why we recommend Toolkit users maintain current deployments.  We upgrade 
packages to mitigate emerging vulnerabilities, and keep our clients safe from attack.  We 
have found that package currency and security are generally well-correlated, so updates 
to prevent vulnerabilities in the package set tend to yield a set of packages that are 
functionally current.

For those packages that are secure and stable, there may be cases where we do not support 
the latest release because a prior version has no known vulnerabilities for a threat actor 
to exploit.  In this case, the package might not be at the latest available version.  We 
ask that in these cases, you request a currency upgrade at the Toolkit ideas portal 
(https://ibm-z-software-portal.ideas.ibm.com/?project=PAITZ).

One of the primary reasons for creating the Python AI Toolkit for IBM z/OS is to provide 
better access to individual packages and improve package currency.  The library of packages 
the Toolkit provides is continuously scanned and re-built as upstream projects enhance and 
improve them.  The currency of any given package is a result of several different factors, 
including feedback from you as the end user.  The goal is to provide the best currency 
posture across all of the packages as a collection.
