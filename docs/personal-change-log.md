# INCREMENTAL LOG

## About the file
This file shows an incremental and complete log for developers with detailed changes.
Keep in mind it can be removed any time. Grammar fixes are welcome, but not really important.

## Version 1.0 (begin)
The SowString born in this version.

## Version 1.1 (contains: additions/feature, fixes)
- Added: resulting tree nodes now can have heading through "useHeading" option;
- Fixed: unnecessary "if" removed, there were no changes to behavior;

## Version 1.1.1 (contains: additions)
- Added: this file was added;
- Added: array nodes have a semantic field "isNode" (always "true"), but are not set to string nodes;

# Version 1.1.2 (contains: fix)
- Fixed: the "src" version was ahead of "dist";

# Version 1.2.0 (contains: additions/docs, update)
- Added: example page now shows the emptyLines option;
- Updated: now empty lines are more consistent and appended after indented blocks;
- Note: This is not considered a "breaking version" because it only fixes the behavior of empty lines. The major version remains unchanged.

# Version 1.3.0 (contains: additions)
- Added: option "filter" now receives a function to filter lines.
- Added: documentation now has the "filter" option.
- Added: example now has a checkbox with an example for filter option.

# Version 1.4.0 (contains: additions)
- Added: option "intercept" now receives a function to intercept the indent calculation.
- Added: documentation for "intercept" option.
- Added: example now has a checkbox to show a bit of the intercept abilities.

# Version 1.5.0 (contains: update)
- Updated: option "intercept" now supports a cache like empty lines, when returning "auto" string instead of a number.
- Updated: documentation for "intercept" option.
- Updated: example has an option to intercept and cache.
