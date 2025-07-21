# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.0.0] - 2025-07-21

### Breaking Changes

- Requires Grafana 11 and Grafana 12.

### Added

- TimeZone option for Date element (#604).

### Changed

- Updated to Grafana 12.0 and dependencies (#607).

## [5.1.0] - 2025-02-26

### Added

- `isEscaping` option for TextArea and CodeEditor elements (#581).
- Support for streaming state for data (#577).

### Changed

- Refactored form elements (#576).
- Updated to Grafana 11.5 and dependencies (#582).
- Updated release workflow to include attestation (#582).

## [5.0.0] - 2024-12-23

### Breaking Changes

- Dashboard variables in Show If, Disabled, and Options are replaced automatically. Function `replaceVariables` is no longer required and has been removed.

### Added

- Form element of type Color (#561).
- Support for variables in data sources (#564).

### Changed

- Updated change value behavior for custom option (#562).
- Updated new lines in Text Area and Code Editor (#563).
- Updated packages for Code Editor (#569).
- Updated element helpers (#570).
- Updated to Grafana 11.4.0 and dependencies (#571).

## [4.9.0] - 2024-11-16

### Added

- HTML and Markdown to supported Code Editor languages (#543).
- Functionality for updating sections dynamically (#542).

### Changed

- Removed `DatasourceResponseError`, moved to external Components (#535).
- Updated options to use datasource ID instead of name (#539).
- Updated E2E tests (#538).
- Updated refresh function in the Update Request (#547).
- Removed default payload from Update Request (#550).

## [4.8.0] - 2024-10-25

### Added

- Date Form element (#520).
- Handling for Data Source Request Errors (#530).

### Changed

- Updated refresh for dashboard scene (#522).
- Updated Text Area and Code Editor elements to escape multi-lines (#520).
- Updated refresh for dashboard scene using `useDashboardRefresh` hook (#528).
- Updated to Grafana 11.3.0 and dependencies (#531).

## [4.7.0] - 2024-10-08

### Added

- Custom input for Select and Multi-Select (#507).
- Support for frames in initial fields (#508).

### Changed

- Updated Autosize Code Editor toolbar (#506).
- Updated behavior for disabled Text Area element (#514).

## [4.6.0] - 2024-09-28

### Added

- Wrap button in the Code Editor (#491).
- Label Background and Label Color for Button element (#502).

### Changed

- Updated initial values for elements from data source (#490).
- Updated loading bar for Initial Request (#492).

## [4.5.0] - 2024-09-06

### Added

- Dashboard variables support in button titles (#479).
- Variable support in sections and labels (#485).

### Changed

- Updated date and time input timezone (#452).
- Updated suggestions position in Code elements (#483).

## [4.4.0] - 2024-08-29

### Added

- Expandable Editors (#472).

### Changed

- Updated Pre-Selection for multi-selection elements (#474).
- Updated data source query display error (#477).

## [4.3.1] - 2024-08-16

### Fixed

- Migration helper for undefined nested object properties (#468).

## [4.3.0] - 2024-08-12

### Added

- Helpers for form elements (#460).
- Element custom button (#463).

### Changed

- Updated payload options migration (#464).

## [4.2.0] - 2024-07-18

### Changed

- Updated Docker Compose and E2E pipeline (#446, #447).
- Improved unit tests (#447).
- Updated Business Forms tutorial (#451).
- Updated logic for comparing values with initial values (#454).
- Updated position of Query fields for initial values (#455).

## [4.1.0] - 2024-07-09

### Changed

- Updated context parameters migration (#433).
- Updated provisioning files (#433).
- Updated Checkbox list with custom options (#435).
- Updated code defaults to use context properties (#438).
- Updated E2E workflow using Docker (#441).

## [4.0.0] - 2024-07-01

### Breaking Changes

- Requires Grafana 10 and Grafana 11.
- Data Source requests updated to use Query Editor.
- Removed non-context code parameters. Please update parameters to use `context`.

### Migration Guide

- `data` -> `context.panel.data`
- `elements` -> `context.panel.elements`
- `initial` -> `context.panel.initial`
- `initialRequest` -> `context.panel.initialRequest`
- `locationService` -> `context.grafana.locationService`
- `notifyError` -> `context.grafana.notifyError`
- `notifySuccess` -> `context.grafana.notifySuccess`
- `notifyWarning` -> `context.grafana.notifyWarning`
- `onChange` -> `context.panel.onChange`
- `onOptionsChange` -> `context.panel.onOptionsChange`
- `options` -> `context.panel.options`
- `replaceVariables` -> `context.grafana.replaceVariables`
- `response` -> `context.panel.response`
- `setInitial` -> `context.panel.setInitial`
- `templateService` -> `context.grafana.templateService`
- `toDataQueryResponse` -> `context.utils.toDataQueryResponse`

### Added

- Support for frontend data sources (#361).
- Custom color/background color for elements (#386).
- Collapsable Sections (#409).

### Changed

- Updated name to Business Forms Panel (#361).
- Updated elected type for a new option (#402).
- Prepared for Grafana 11 (#399).
- Updated Reset button handler (#422).
- Updated Confirmation Window (#420).
- Updated error handling in code editors for `showIf`, `disableIf`, and `getOptions` (#410).
- Updated description for Get Options Code (#404).
- Updated to Grafana 11.1 and dependencies (#426).
- Updated Date Time query field (#429).

## [3.8.0] - 2024-05-30

### Added

- Checkbox List element (#382).
- Syntax support in Code Editor (#383).
- Plugin E2E tests, removed Cypress (#390).
- Server-based form elements example (#392).
- Input type time (#385).
- Form validation provisioning dashboard (#411).

### Changed

- Updated hiding/showing multi-select element (#389).
- Updated allowed files for file type (#388).

## [3.7.0] - 2024-03-10

### Breaking Changes

- Requires Grafana 9.2 and Grafana 10.

### Added

- Update enabled option and variables examples (#356).
- Files upload examples (#357).
- Code parameters with builder and initial request to element value changed code (#358).
- Ability to disable columns in confirmation modal (#360).
- Multiple files option (#375).

### Changed

- Updated dependencies and Actions (#368).
- Added skipping elements hidden using Show If from update payload (#369).

## [3.6.0] - 2023-01-10

### Added

- Backend service to custom code (#331).
- Support for file base64 encoding in payload (#331).
- Context parameter to Payload (#331).

### Fixed

- Element custom options source (#334).

## [3.5.0] - 2023-01-04

### Added

- `disableIf` code (#321).
- Code options source for select element (#323).
- Value changed code (#324).
- Suggestions for code editors (#327).
- Reset button confirmation (#328).

### Changed

- Updated reset request visibility if reset button is hidden (#322).
- Updated to Node 20 (#326).

## [3.4.0] - 2023-12-14

### Added

- Ability to disable panel syncing (#298).
- EventBus and AppEvents to Context (#307).
- Options migration (#315).

### Changed

- Updated ESLint configuration and refactor (#299).
- Updated Collapse from `@volkovlabs/components` (#299).
- Added replacing variables in Payload functions (#309).
- Updated to Grafana 10.2.2 and Volkov Labs packages (#313).

### Fixed

- Draggable control to support upcoming Grafana changes (#314).

## [3.3.0] - 2023-11-21

### Added

- Disabled Text Area element type (#243).
- Confirmation Window options (#242).
- Context object to custom code (#255).
- Select Options From Query (#254).
- NumberInput component allowing decimals (#291).
- Autosize Code Editor (#295).
- Data Source option for Reset button (#296).
- Link Element (#297).

### Changed

- Updated to Plugin Tools 2.1.1 (#292).
- Used Grafana Access Policy to sign plugin (#292).
- Updated to Grafana 10.2.1 (#292).
- Updated ESLint configuration (#294).

### Fixed

- Allowed entering zero value in number field (#288).

## [3.2.1] - 2023-09-07

### Added

- Backward compatibility for option ID (#244).

## [3.2.0] - 2023-09-06

### Added

- Min and max date for DateTime element (#225).
- Mapping Data Source values to elements (#224).
- Clearing errors before initial and update requests (#232).
- URL encode to variables (#231).
- Query Field Picker for Initial Request (#227).
- File element type for File Upload (#229).
- Loading states for Initial, Update, and Reset button actions (#234).
- Support for asynchronous custom code (#234).
- Icons for radio and select options (#238).

### Changed

- Updated element `Show If` to support variables (#230).
- Allowed empty section name (#228).
- Added converting option value to string and number based on type (#233).
- Updated Query and Data Source initial request (#237).

## [3.1.0] - 2023-08-13

### Added

- `onChange` to update elements in local state within custom code (#214).
- Multi-Select element (#217).
- Conditional element visibility (#219).
- Custom payload code editor (#220).
- Custom reset code editor (#221).
- Data Source request (#222).

### Changed

- Updated Jest selectors to use npm package (#209).
- Updated ESLint configuration (#215).

## [3.0.0] - 2023-07-15

### Breaking Changes

- Requires Grafana 9 and Grafana 10.
- Form Elements are kept in local state and not saved in the dashboard by default.
- Local states and elements refactoring may introduce breaking changes. Please test before using in Production.

### Added

- Hidden option to String element (#171).
- E2E Cypress testing (#180).
- `notifyWarning()` function (#201).
- Drag and drop for elements editor (#202).
- Vertical layout orientation (#206).

### Changed

- Updated Documentation for API Servers (#149).
- Updated to Grafana 10.0.0 (#165, #172, #184, #200).
- Increased Test Coverage and updated Test library (#181, #183, #185).
- Updated Form Elements to delay save changes with auto-save (#186).
- Migrated to Plugin Tools 1.5.2 (#187, #192).
- Updated to Node 18 (#188).
- Updated constants and E2E tests (#190).
- Updated Form elements to use local state (#191).
- Removed Grafana 8.5 support (#203).
- Added running initial request on initial updates (#205).

## [2.8.0] - 2023-03-16

### Added

- String, Number Type for Select and Radio options (#120).
- Lookup options for Disabled element (#121).
- Server API with MySQL for Feedback Dashboard (#125).
- Option for DELETE request (#130).
- "Buttons only" Layout to do GET/POST/DELETE requests (#131).
- NoPadding to remove extra padding around and make it configurable (#146).

### Changed

- Updated to Grafana 9.3.1 (#129).
- Updated to Grafana 9.4.3 (#146).
- Updated README and moved Documentation to docs.volkovlabs.io (#132).
- Updated README and Documentation (#134, #147).
- Refactored API Servers (#128).
- Updated CI and Release workflows (#145).

### Fixed

- Password and Boolean elements confirmation (#120).

## [2.7.0] - 2022-11-10

### Added

- Status notification after form submission (#98).
- Monaco Code Editor suggestions for available parameters (#88).
- Initial values parameter to Update Request parameters (#117).

### Changed

- Updated to Grafana 9.2.2 (#113).
- Updated CI to upload signed artifacts (#116).
- Allowed sending all or updated-only values in Payload (#116).

## [2.6.0] - 2022-10-23

### Added

- Compatibility Check Workflow (#92).
- Custom Code to update variable after update request (#106).
- Number Input and Slider min, max validation (#95).
- Initialization of element value from a Data Source query (#105).

### Changed

- Updated to Grafana 9.1.6 (#92).
- Updated CI to Node 16 and synchronized with Release workflow (#109).

### Fixed

- Initial GET request date time formatting (#99).

## [2.5.0] - 2022-09-10

### Added

- Request Header check (#85).
- Exposed `initialRequest()` in Custom Code to reload panel (#89).

### Changed

- Set `json` as response data from Initial Request (#90).
- Updated to Grafana 9.1.4 (#91).

## [2.4.0] - 2022-08-31

### Added

- Variables in URL to call from form elements (#78).
- Deno Deploy Playground server and dashboard (#80).
- "How to Manipulate Data using Grafana dashboard" video in README (#80).

### Changed

- Updated to Grafana 9.1.1 (#72).
- Explained how to use Dashboard Variables in README (#73).
- Added `onOptionsChange` in examples to update the panel (#75).
- Added Custom Update Request to README (#79).
- Showed Title instead of Id in the Confirmation Panel (#81).
- Avoided showing confirmation for disabled elements (#77).
- Improved Test Coverage (#21).

## [2.3.0] - 2022-08-11

### Breaking Changes

- Signed as Community Plugin.

### Changed

- Updated Sample code in README (#67).
- Updated to be included in the Grafana Marketplace (#68).

## [2.2.0] - 2022-08-09

### Added

- Ability to get Elements Initial Value and Configuration from Data Source (#22).

### Changed

- Updated to Grafana 9.0.6 (#63).
- Updated Alert when no elements defined (#66).

### Fixed

- Number Slider not updated properly (#18).

## [2.1.0] - 2022-07-17

### Added

- Automatic Code Editor Formatting (#59).

### Changed

- Rebuilt based on 9.0.3 (#58).
- Explained Custom code in README (#60).
- Updated YouTube link with tutorial in README (#61).

## [2.0.0] - 2022-06-17

### Breaking Changes

- Requires Grafana 8.3+ and 9.0+.

### Changed

- Rebuilt based on 9.0.0 (#53).

## [1.4.0] - 2022-05-30

### Added

- Highlight for changed values (#51).
- Confirmation before Submit (#52).

### Changed

- Allowed updating Element Width (#50).

## [1.3.0] - 2022-05-22

### Added

- Layout to have sections for Form Fields (#47).
- None Request for Initial and Update requests (#48).
- Code Editor Element for Configuration Forms (#23).

### Changed

- Updated Architecture Diagram (#44).
- Updated layout to have sections for Form Fields (#47).

### Fixed

- Changing colors on Submit not working properly (#43).

## [1.2.0] - 2022-05-19

### Added

- Label Width and Tooltip (#39).
- Server API with Postgres for Feedback Dashboard (#36).
- Input Parameters to Form Elements (#41).

## [1.1.0] - 2022-05-12

### Added

- Disabled Element (#24).
- Ability to move elements up and down (#19).
- Split Disabled layout for Input/Output (#27).
- Interpolate Variables (#28).
- Min and Max for Numbers (#29).
- Unit Label (#31).
- Header Parameters (#32).
- Password Input (#33).
- Subscription to Refresh Events (#30).

## [1.0.0] - 2022-05-11

### Added

- Initial release based on the Volkov Labs Panel template 1.5.0.
