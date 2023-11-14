# Python and Supply Chain Security
One of the primary reasons for creating the Python AI Toolkit is to provide a _**secure**_ 
foundational layer for the AI stack on z/OS.  A great deal of effort goes in to properly
vetting all member packages to ensure that they are free of vulnerabilities that could lead
to an attack from a threat actor.

## Vetting the Code Base
Package vetting follows IBM's 
[Security and Privacy by Design](https://www.ibm.com/support/pages/ibm-security-and-privacy-design)
(SPbD) practices to ensure that the Toolkit meets the same security standards as a proprietary IBM
product.  Note that this does not address the overall quality of the code from a given upstream community, which may have functional deficiencies and bugs that do not lead to a security exposure.
In this sense, the behavior of an open source package in the Toolkit will be the same as on other 
platforms.  However, by screening out security issues, the Toolkit will generally
contain the best versions of a given package, leaving out those versions with significant problems.

Key steps to the vetting process include:
- A threat model.  Before any release of the Toolkit is made available, it is assessed to understand
all of the attack surfaces that can be exploited.  From this model the team enumerates all of the 
necessary steps in the vetting process.  As new packages are added to the Toolkit over time, this 
threat model is reviewed to see if additional measures are required. 
- Static code analysis - scanning the source code for known problems 
([CVEs](https://nvd.nist.gov/)).  Packages with high
and critical severity problems (scores > 7) are not published.  Packages with lower severity 
problems may be published with a remediation plan.
- Weakness scan - another form of static code analysis, this looks for techniques and references
to resources that can pose a threat.  For example, referencing a URL with an ```HTTP``` prefix
rather than a secure URL will be flagged and remediated.
- Secrets scan - a search for embedded credentials, like passwords or keys that could be acquired 
from a Python package by an attacker, and used for unauthorized access.  
- All integrated tests from the upstream community are run and reviewed.  Failures are researched 
to determine if they are relevant to the z/OS platform.  No package is published until testing 
shows the results that are expected.
- Additional copyright checks.  Sometimes an open source contributor may take a shortcut and copy
a section of code from another project rather than write code themselves, or build a proper 
dependency on another package.  This provides some protection against inadvertent copyright 
infringement.

Additional security measures taken when creating the Toolkit include:
- Eliminating test code - many open source packages include integrated tests for error paths and 
edge cases.  Open source communities are known to be slow, or unwilling to remediate CVEs in 
these code paths because they aren't core to the function of the package.  The toolkit builds
most packages without test code if it's determined that it include a weakness or outright 
vulnerability, regardless of whether it's a regular functional path or not.
- Continuous scanning - static code analysis is repeated for every commit made to a package's 
source library.  There is no real chance to a vulnerability to slip into the code base between 
scans.