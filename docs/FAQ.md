# Frequently Asked Questions

## 1. Pip package installation fails with OSError(124, EDC5124I Too many open files.)

While installing Python packages using `pip` on z/OS, installations of large wheel files may fail with:

`OSError(124, 'EDC5124I Too many open files.')`

**Solution:**  

This occurs when the default OMVS setting `MAXMMAPAREA` (40960) is insufficient for handling large package installations.
Increase the OMVS `MAXMMAPAREA` value.  Our testing shows that setting: `MAXMMAPAREA=50000` allows successful
installation of large Python packages.
