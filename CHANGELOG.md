# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.1.0] - 2025-08-31

### Changed

- Updated ESLint configuration for improved code quality ([#611](https://github.com/volkovlabs/business-forms/issues/611)).
- Updated Development Provisioning ([#616](https://github.com/volkovlabs/business-forms/issues/616)).

## [6.0.0] - 2025-07-21

### Breaking Changes

- Now requires Grafana 11 and Grafana 12.

### Added

- Added TimeZone option for Date element ([#604](https://github.com/volkovlabs/business-forms/issues/604)).

### Changed

- Updated to Grafana 12.0 and related dependencies ([#607](https://github.com/volkovlabs/business-forms/issues/607)).

## [5.1.0] - 2025-02-26

### Added

- Introduced `isEscaping` option for TextArea and CodeEditor elements ([#581](https://github.com/volkovlabs/business-forms/issues/581)).
- Added support for streaming state for data ([#577](https://github.com/volkovlabs/business-forms/issues/577)).

### Changed

- Refactored form elements for better maintainability ([#576](https://github.com/volkovlabs/business-forms/issues/576)).
- Updated to Grafana 11.5 and dependencies ([#582](https://github.com/volkovlabs/business-forms/issues/582)).
- Enhanced release workflow to include attestation ([#582](https://github.com/volkovlabs/business-forms/issues/582)).

## [5.0.0] - 2024-12-23

### Breaking Changes

- Dashboard variables in Show If, Disabled, and Options are now replaced automatically. The `replaceVariables` function is no longer required and has been removed.

### Added

- Introduced Form element of type Color ([#561](https://github.com/volkovlabs/business-forms/issues/561)).
- Added support for variables in data sources ([#564](https://github.com/volkovlabs/business-forms/issues/564)).

### Changed

- Updated change value behavior for custom options ([#562](https://github.com/volkovlabs/business-forms/issues/562)).
- Improved handling of new lines in Text Area and Code Editor ([#563](https://github.com/volkovlabs/business-forms/issues/563)).
- Updated packages for Code Editor ([#569](https://github.com/volkovlabs/business-forms/issues/569)).
- Enhanced element helpers ([#570](https://github.com/volkovlabs/business-forms/issues/570)).
- Updated to Grafana 11.4.0 and dependencies ([#571](https://github.com/volkovlabs/business-forms/issues/571)).

## [4.9.0] - 2024-11-16

### Added

- Added HTML and Markdown to supported Code Editor languages ([#543](https://github.com/volkovlabs/business-forms/issues/543)).
- Introduced functionality for updating sections dynamically ([#542](https://github.com/volkovlabs/business-forms/issues/542)).

### Changed

- Removed `DatasourceResponseError`, moved to external Components ([#535](https://github.com/volkovlabs/business-forms/issues/535)).
- Updated options to use datasource ID instead of name ([#539](https://github.com/volkovlabs/business-forms/issues/539)).
- Improved E2E tests ([#538](https://github.com/volkovlabs/business-forms/issues/538)).
- Updated refresh function in the Update Request ([#547](https://github.com/volkovlabs/business-forms/issues/547)).
- Removed default payload from Update Request ([#550](https://github.com/volkovlabs/business-forms/issues/550)).

## [4.8.0] - 2024-10-25

### Added

- Introduced Date Form element ([#520](https://github.com/volkovlabs/business-forms/issues/520)).
- Added handling for Data Source Request Errors ([#530](https://github.com/volkovlabs/business-forms/issues/530)).

### Changed

- Updated refresh mechanism for dashboard scene ([#522](https://github.com/volkovlabs/business-forms/issues/522)).
- Enhanced Text Area and Code Editor elements to escape multi-lines ([#520](https://github.com/volkovlabs/business-forms/issues/520)).
- Updated refresh for dashboard scene using `useDashboardRefresh` hook ([#528](https://github.com/volkovlabs/business-forms/issues/528)).
- Updated to Grafana 11.3.0 and dependencies ([#531](https://github.com/volkovlabs/business-forms/issues/531)).

## [4.7.0] - 2024-10-08

### Added

- Added custom input for Select and Multi-Select elements ([#507](https://github.com/volkovlabs/business-forms/issues/507)).
- Introduced support for frames in initial fields ([#508](https://github.com/volkovlabs/business-forms/issues/508)).

### Changed

- Updated Autosize Code Editor toolbar ([#506](https://github.com/volkovlabs/business-forms/issues/506)).
- Improved behavior for disabled Text Area element ([#514](https://github.com/volkovlabs/business-forms/issues/514)).

## [4.6.0] - 2024-09-28

### Added

- Added Wrap button in the Code Editor ([#491](https://github.com/volkovlabs/business-forms/issues/491)).
- Introduced Label Background and Label Color for Button element ([#502](https://github.com/volkovlabs/business-forms/issues/502)).

### Changed

- Updated initial values for elements from data source ([#490](https://github.com/volkovlabs/business-forms/issues/490)).
- Improved loading bar for Initial Request ([#492](https://github.com/volkovlabs/business-forms/issues/492)).

## [4.5.0] - 2024-09-06

### Added

- Added support for dashboard variables in button titles ([#479](https://github.com/volkovlabs/business-forms/issues/479)).
- Introduced variable support in sections and labels ([#485](https://github.com/volkovlabs/business-forms/issues/485)).

### Changed

- Updated date and time input timezone handling ([#452](https://github.com/volkovlabs/business-forms/issues/452)).
- Improved suggestions position in Code elements ([#483](https://github.com/volkovlabs/business-forms/issues/483)).

## [4.4.0] - 2024-08-29

### Added

- Introduced Expandable Editors ([#472](https://github.com/volkovlabs/business-forms/issues/472)).

### Changed

- Updated Pre-Selection for multi-selection elements ([#474](https://github.com/volkovlabs/business-forms/issues/474)).
- Improved data source query display error handling ([#477](https://github.com/volkovlabs/business-forms/issues/477)).

## [4.3.1] - 2024-08-16

### Fixed

- Fixed migration helper for undefined nested object properties ([#468](https://github.com/volkovlabs/business-forms/issues/468)).

## [4.3.0] - 2024-08-12

### Added

- Added helpers for form elements ([#460](https://github.com/volkovlabs/business-forms/issues/460)).
- Introduced element custom button ([#463](https://github.com/volkovlabs/business-forms/issues/463)).

### Changed

- Updated payload options migration ([#464](https://github.com/volkovlabs/business-forms/issues/464)).

## [4.2.0] - 2024-07-18

### Changed

- Updated Docker Compose and E2E pipeline ([#446](https://github.com/volkovlabs/business-forms/issues/446), [#447](https://github.com/volkovlabs/business-forms/issues/447)).
- Improved unit tests ([#447](https://github.com/volkovlabs/business-forms/issues/447)).
- Updated Business Forms tutorial ([#451](https://github.com/volkovlabs/business-forms/issues/451)).
- Enhanced logic for comparing values with initial values ([#454](https://github.com/volkovlabs/business-forms/issues/454)).
- Updated position of Query fields for initial values ([#455](https://github.com/volkovlabs/business-forms/issues/455)).

## [4.1.0] - 2024-07-09

### Changed

- Updated context parameters migration ([#433](https://github.com/volkovlabs/business-forms/issues/433)).
- Enhanced provisioning files ([#433](https://github.com/volkovlabs/business-forms/issues/433)).
- Updated Checkbox list with custom options ([#435](https://github.com/volkovlabs/business-forms/issues/435)).
- Improved code defaults to use context properties ([#438](https://github.com/volkovlabs/business-forms/issues/438)).
- Updated E2E workflow using Docker ([#441](https://github.com/volkovlabs/business-forms/issues/441)).

## [4.0.0] - 2024-07-01

### Breaking Changes

- Now requires Grafana 10 and Grafana 11.
- Data Source requests updated to use Query Editor.
- Removed non-context code parameters. Please update parameters to use `context`.

### Migration Guide

- `data` → `context.panel.data`
- `elements` → `context.panel.elements`
- `initial` → `context.panel.initial`
- `initialRequest` → `context.panel.initialRequest`
- `locationService` → `context.grafana.locationService`
- `notifyError` → `context.grafana.notifyError`
- `notifySuccess` → `context.grafana.notifySuccess`
- `notifyWarning` → `context.grafana.notifyWarning`
- `onChange` → `context.panel.onChange`
- `onOptionsChange` → `context.panel.onOptionsChange`
- `options` → `context.panel.options`
- `replaceVariables` → `context.grafana.replaceVariables`
- `response` → `context.panel.response`
- `setInitial` → `context.panel.setInitial`
- `templateService` → `context.grafana.templateService`
- `toDataQueryResponse` → `context.utils.toDataQueryResponse`

### Added

- Added support for frontend data sources ([#361](https://github.com/volkovlabs/business-forms/issues/361)).
- Introduced custom color/background color for elements ([#386](https://github.com/volkovlabs/business-forms/issues/386)).
- Added collapsible sections ([#409](https://github.com/volkovlabs/business-forms/issues/409)).

### Changed

- Renamed to Business Forms Panel ([#361](https://github.com/volkovlabs/business-forms/issues/361)).
- Updated selected type for new options ([#402](https://github.com/volkovlabs/business-forms/issues/402)).
- Prepared for Grafana 11 compatibility ([#399](https://github.com/volkovlabs/business-forms/issues/399)).
- Updated Reset button handler ([#422](https://github.com/volkovlabs/business-forms/issues/422)).
- Enhanced Confirmation Window ([#420](https://github.com/volkovlabs/business-forms/issues/420)).
- Improved error handling in code editors for `showIf`, `disableIf`, and `getOptions` ([#410](https://github.com/volkovlabs/business-forms/issues/410)).
- Updated description for Get Options Code ([#404](https://github.com/volkovlabs/business-forms/issues/404)).
- Updated to Grafana 11.1 and dependencies ([#426](https://github.com/volkovlabs/business-forms/issues/426)).
- Enhanced Date Time query field ([#429](https://github.com/volkovlabs/business-forms/issues/429)).

## [3.8.0] - 2024-05-30

### Added

- Introduced Checkbox List element ([#382](https://github.com/volkovlabs/business-forms/issues/382)).
- Added syntax support in Code Editor ([#383](https://github.com/volkovlabs/business-forms/issues/383)).
- Implemented plugin E2E tests, removed Cypress ([#390](https://github.com/volkovlabs/business-forms/issues/390)).
- Added server-based form elements example ([#392](https://github.com/volkovlabs/business-forms/issues/392)).
- Introduced input type time ([#385](https://github.com/volkovlabs/business-forms/issues/385)).
- Added form validation provisioning dashboard ([#411](https://github.com/volkovlabs/business-forms/issues/411)).

### Changed

- Improved hiding/showing multi-select element ([#389](https://github.com/volkovlabs/business-forms/issues/389)).
- Updated allowed files for file type ([#388](https://github.com/volkovlabs/business-forms/issues/388)).

## [3.7.0] - 2024-03-10

### Breaking Changes

- Now requires Grafana 9.2 and Grafana 10.

### Added

- Added update enabled option and variables examples ([#356](https://github.com/volkovlabs/business-forms/issues/356)).
- Introduced files upload examples ([#357](https://github.com/volkovlabs/business-forms/issues/357)).
- Added code parameters with builder and initial request to element value changed code ([#358](https://github.com/volkovlabs/business-forms/issues/358)).
- Introduced ability to disable columns in confirmation modal ([#360](https://github.com/volkovlabs/business-forms/issues/360)).
- Added multiple files option ([#375](https://github.com/volkovlabs/business-forms/issues/375)).

### Changed

- Updated dependencies and Actions ([#368](https://github.com/volkovlabs/business-forms/issues/368)).
- Added skipping elements hidden using Show If from update payload ([#369](https://github.com/volkovlabs/business-forms/issues/369)).

## [3.6.0] - 2023-01-10

### Added

- Introduced backend service to custom code ([#331](https://github.com/volkovlabs/business-forms/issues/331)).
- Added support for file base64 encoding in payload ([#331](https://github.com/volkovlabs/business-forms/issues/331)).
- Introduced context parameter to Payload ([#331](https://github.com/volkovlabs/business-forms/issues/331)).

### Fixed

- Fixed element custom options source ([#334](https://github.com/volkovlabs/business-forms/issues/334)).

## [3.5.0] - 2023-01-04

### Added

- Introduced `disableIf` code ([#321](https://github.com/volkovlabs/business-forms/issues/321)).
- Added code options source for select element ([#323](https://github.com/volkovlabs/business-forms/issues/323)).
- Introduced value changed code ([#324](https://github.com/volkovlabs/business-forms/issues/324)).
- Added suggestions for code editors ([#327](https://github.com/volkovlabs/business-forms/issues/327)).
- Introduced reset button confirmation ([#328](https://github.com/volkovlabs/business-forms/issues/328)).

### Changed

- Updated reset request visibility if reset button is hidden ([#322](https://github.com/volkovlabs/business-forms/issues/322)).
- Updated to Node 20 ([#326](https://github.com/volkovlabs/business-forms/issues/326)).

## [3.4.0] - 2023-12-14

### Added

- Added ability to disable panel syncing ([#298](https://github.com/volkovlabs/business-forms/issues/298)).
- Introduced EventBus and AppEvents to Context ([#307](https://github.com/volkovlabs/business-forms/issues/307)).
- Added options migration ([#315](https://github.com/volkovlabs/business-forms/issues/315)).

### Changed

- Updated ESLint configuration and refactored code ([#299](https://github.com/volkovlabs/business-forms/issues/299)).
- Updated Collapse from `@volkovlabs/components` ([#299](https://github.com/volkovlabs/business-forms/issues/299)).
- Added replacing variables in Payload functions ([#309](https://github.com/volkovlabs/business-forms/issues/309)).
- Updated to Grafana 10.2.2 and Volkov Labs packages ([#313](https://github.com/volkovlabs/business-forms/issues/313)).

### Fixed

- Fixed draggable control to support upcoming Grafana changes ([#314](https://github.com/volkovlabs/business-forms/issues/314)).

## [3.3.0] - 2023-11-21

### Added

- Introduced Disabled Text Area element type ([#243](https://github.com/volkovlabs/business-forms/issues/243)).
- Added Confirmation Window options ([#242](https://github.com/volkovlabs/business-forms/issues/242)).
- Introduced Context object to custom code ([#255](https://github.com/volkovlabs/business-forms/issues/255)).
- Added Select Options From Query ([#254](https://github.com/volkovlabs/business-forms/issues/254)).
- Introduced NumberInput component allowing decimals ([#291](https://github.com/volkovlabs/business-forms/issues/291)).
- Added Autosize Code Editor ([#295](https://github.com/volkovlabs/business-forms/issues/295)).
- Introduced Data Source option for Reset button ([#296](https://github.com/volkovlabs/business-forms/issues/296)).
- Added Link Element ([#297](https://github.com/volkovlabs/business-forms/issues/297)).

### Changed

- Updated to Plugin Tools 2.1.1 ([#292](https://github.com/volkovlabs/business-forms/issues/292)).
- Used Grafana Access Policy to sign plugin ([#292](https://github.com/volkovlabs/business-forms/issues/292)).
- Updated to Grafana 10.2.1 ([#292](https://github.com/volkovlabs/business-forms/issues/292)).
- Updated ESLint configuration ([#294](https://github.com/volkovlabs/business-forms/issues/294)).

### Fixed

- Fixed ability to enter zero value in number field ([#288](https://github.com/volkovlabs/business-forms/issues/288)).

## [3.2.1] - 2023-09-07

### Added

- Added backward compatibility for option ID ([#244](https://github.com/volkovlabs/business-forms/issues/244)).

## [3.2.0] - 2023-09-06

### Added

- Introduced min and max date for DateTime element ([#225](https://github.com/volkovlabs/business-forms/issues/225)).
- Added mapping Data Source values to elements ([#224](https://github.com/volkovlabs/business-forms/issues/224)).
- Introduced clearing errors before initial and update requests ([#232](https://github.com/volkovlabs/business-forms/issues/232)).
- Added URL encode to variables ([#231](https://github.com/volkovlabs/business-forms/issues/231)).
- Introduced Query Field Picker for Initial Request ([#227](https://github.com/volkovlabs/business-forms/issues/227)).
- Added File element type for File Upload ([#229](https://github.com/volkovlabs/business-forms/issues/229)).
- Introduced loading states for Initial, Update, and Reset button actions ([#234](https://github.com/volkovlabs/business-forms/issues/234)).
- Added support for asynchronous custom code ([#234](https://github.com/volkovlabs/business-forms/issues/234)).
- Introduced icons for radio and select options ([#238](https://github.com/volkovlabs/business-forms/issues/238)).

### Changed

- Updated element `Show If` to support variables ([#230](https://github.com/volkovlabs/business-forms/issues/230)).
- Allowed empty section name ([#228](https://github.com/volkovlabs/business-forms/issues/228)).
- Added converting option value to string and number based on type ([#233](https://github.com/volkovlabs/business-forms/issues/233)).
- Updated Query and Data Source initial request ([#237](https://github.com/volkovlabs/business-forms/issues/237)).

## [3.1.0] - 2023-08-13

### Added

- Introduced `onChange` to update elements in local state within custom code ([#214](https://github.com/volkovlabs/business-forms/issues/214)).
- Added Multi-Select element ([#217](https://github.com/volkovlabs/business-forms/issues/217)).
- Introduced conditional element visibility ([#219](https://github.com/volkovlabs/business-forms/issues/219)).
- Added custom payload code editor ([#220](https://github.com/volkovlabs/business-forms/issues/220)).
- Introduced custom reset code editor ([#221](https://github.com/volkovlabs/business-forms/issues/221)).
- Added Data Source request ([#222](https://github.com/volkovlabs/business-forms/issues/222)).

### Changed

- Updated Jest selectors to use npm package ([#209](https://github.com/volkovlabs/business-forms/issues/209)).
- Updated ESLint configuration ([#215](https://github.com/volkovlabs/business-forms/issues/215)).

## [3.0.0] - 2023-07-15

### Breaking Changes

- Now requires Grafana 9 and Grafana 10.
- Form Elements are kept in local state and not saved in the dashboard by default.
- Local states and elements refactoring may introduce breaking changes. Please test before using in Production.

### Added

- Introduced hidden option to String element ([#171](https://github.com/volkovlabs/business-forms/issues/171)).
- Added E2E Cypress testing ([#180](https://github.com/volkovlabs/business-forms/issues/180)).
- Introduced `notifyWarning()` function ([#201](https://github.com/volkovlabs/business-forms/issues/201)).
- Added drag and drop for elements editor ([#202](https://github.com/volkovlabs/business-forms/issues/202)).
- Introduced vertical layout orientation ([#206](https://github.com/volkovlabs/business-forms/issues/206)).

### Changed

- Updated Documentation for API Servers ([#149](https://github.com/volkovlabs/business-forms/issues/149)).
- Updated to Grafana 10.0.0 ([#165](https://github.com/volkovlabs/business-forms/issues/165), [#172](https://github.com/volkovlabs/business-forms/issues/172), [#184](https://github.com/volkovlabs/business-forms/issues/184), [#200](https://github.com/volkovlabs/business-forms/issues/200)).
- Increased Test Coverage and updated Test library ([#181](https://github.com/volkovlabs/business-forms/issues/181), [#183](https://github.com/volkovlabs/business-forms/issues/183), [#185](https://github.com/volkovlabs/business-forms/issues/185)).
- Updated Form Elements to delay save changes with auto-save ([#186](https://github.com/volkovlabs/business-forms/issues/186)).
- Migrated to Plugin Tools 1.5.2 ([#187](https://github.com/volkovlabs/business-forms/issues/187), [#192](https://github.com/volkovlabs/business-forms/issues/192)).
- Updated to Node 18 ([#188](https://github.com/volkovlabs/business-forms/issues/188)).
- Updated constants and E2E tests ([#190](https://github.com/volkovlabs/business-forms/issues/190)).
- Updated Form elements to use local state ([#191](https://github.com/volkovlabs/business-forms/issues/191)).
- Removed Grafana 8.5 support ([#203](https://github.com/volkovlabs/business-forms/issues/203)).
- Added running initial request on initial updates ([#205](https://github.com/volkovlabs/business-forms/issues/205)).

## [2.8.0] - 2023-03-16

### Added

- Introduced String, Number Type for Select and Radio options ([#120](https://github.com/volkovlabs/business-forms/issues/120)).
- Added lookup options for Disabled element ([#121](https://github.com/volkovlabs/business-forms/issues/121)).
- Introduced Server API with MySQL for Feedback Dashboard ([#125](https://github.com/volkovlabs/business-forms/issues/125)).
- Added option for DELETE request ([#130](https://github.com/volkovlabs/business-forms/issues/130)).
- Introduced "Buttons only" Layout to do GET/POST/DELETE requests ([#131](https://github.com/volkovlabs/business-forms/issues/131)).
- Added NoPadding to remove extra padding around and make it configurable ([#146](https://github.com/volkovlabs/business-forms/issues/146)).

### Changed

- Updated to Grafana 9.3.1 ([#129](https://github.com/volkovlabs/business-forms/issues/129)).
- Updated to Grafana 9.4.3 ([#146](https://github.com/volkovlabs/business-forms/issues/146)).
- Updated README and moved Documentation to docs.volkovlabs.io ([#132](https://github.com/volkovlabs/business-forms/issues/132)).
- Updated README and Documentation ([#134](https://github.com/volkovlabs/business-forms/issues/134), [#147](https://github.com/volkovlabs/business-forms/issues/147)).
- Refactored API Servers ([#128](https://github.com/volkovlabs/business-forms/issues/128)).
- Updated CI and Release workflows ([#145](https://github.com/volkovlabs/business-forms/issues/145)).

### Fixed

- Fixed Password and Boolean elements confirmation ([#120](https://github.com/volkovlabs/business-forms/issues/120)).

## [2.7.0] - 2022-11-10

### Added

- Introduced status notification after form submission ([#98](https://github.com/volkovlabs/business-forms/issues/98)).
- Added Monaco Code Editor suggestions for available parameters ([#88](https://github.com/volkovlabs/business-forms/issues/88)).
- Introduced initial values parameter to Update Request parameters ([#117](https://github.com/volkovlabs/business-forms/issues/117)).

### Changed

- Updated to Grafana 9.2.2 ([#113](https://github.com/volkovlabs/business-forms/issues/113)).
- Updated CI to upload signed artifacts ([#116](https://github.com/volkovlabs/business-forms/issues/116)).
- Allowed sending all or updated-only values in Payload ([#116](https://github.com/volkovlabs/business-forms/issues/116)).

## [2.6.0] - 2022-10-23

### Added

- Introduced Compatibility Check Workflow ([#92](https://github.com/volkovlabs/business-forms/issues/92)).
- Added custom code to update variable after update request ([#106](https://github.com/volkovlabs/business-forms/issues/106)).
- Introduced Number Input and Slider min, max validation ([#95](https://github.com/volkovlabs/business-forms/issues/95)).
- Added initialization of element value from a Data Source query ([#105](https://github.com/volkovlabs/business-forms/issues/105)).

### Changed

- Updated to Grafana 9.1.6 ([#92](https://github.com/volkovlabs/business-forms/issues/92)).
- Updated CI to Node 16 and synchronized with Release workflow ([#109](https://github.com/volkovlabs/business-forms/issues/109)).

### Fixed

- Fixed initial GET request date time formatting ([#99](https://github.com/volkovlabs/business-forms/issues/99)).

## [2.5.0] - 2022-09-10

### Added

- Introduced Request Header check ([#85](https://github.com/volkovlabs/business-forms/issues/85)).
- Added exposed `initialRequest()` in Custom Code to reload panel ([#89](https://github.com/volkovlabs/business-forms/issues/89)).

### Changed

- Set `json` as response data from Initial Request ([#90](https://github.com/volkovlabs/business-forms/issues/90)).
- Updated to Grafana 9.1.4 ([#91](https://github.com/volkovlabs/business-forms/issues/91)).

## [2.4.0] - 2022-08-31

### Added

- Introduced variables in URL to call from form elements ([#78](https://github.com/volkovlabs/business-forms/issues/78)).
- Added Deno Deploy Playground server and dashboard ([#80](https://github.com/volkovlabs/business-forms/issues/80)).
- Introduced "How to Manipulate Data using Grafana dashboard" video in README ([#80](https://github.com/volkovlabs/business-forms/issues/80)).

### Changed

- Updated to Grafana 9.1.1 ([#72](https://github.com/volkovlabs/business-forms/issues/72)).
- Explained how to use Dashboard Variables in README ([#73](https://github.com/volkovlabs/business-forms/issues/73)).
- Added `onOptionsChange` in examples to update the panel ([#75](https://github.com/volkovlabs/business-forms/issues/75)).
- Added Custom Update Request to README ([#79](https://github.com/volkovlabs/business-forms/issues/79)).
- Showed Title instead of Id in the Confirmation Panel ([#81](https://github.com/volkovlabs/business-forms/issues/81)).
- Avoided showing confirmation for disabled elements ([#77](https://github.com/volkovlabs/business-forms/issues/77)).
- Improved Test Coverage ([#21](https://github.com/volkovlabs/business-forms/issues/21)).

## [2.3.0] - 2022-08-11

### Breaking Changes

- Signed as Community Plugin.

### Changed

- Updated Sample code in README ([#67](https://github.com/volkovlabs/business-forms/issues/67)).
- Updated to be included in the Grafana Marketplace ([#68](https://github.com/volkovlabs/business-forms/issues/68)).

## [2.2.0] - 2022-08-09

### Added

- Introduced ability to get Elements Initial Value and Configuration from Data Source ([#22](https://github.com/volkovlabs/business-forms/issues/22)).

### Changed

- Updated to Grafana 9.0.6 ([#63](https://github.com/volkovlabs/business-forms/issues/63)).
- Updated Alert when no elements defined ([#66](https://github.com/volkovlabs/business-forms/issues/66)).

### Fixed

- Fixed Number Slider not updated properly ([#18](https://github.com/volkovlabs/business-forms/issues/18)).

## [2.1.0] - 2022-07-17

### Added

- Introduced Automatic Code Editor Formatting ([#59](https://github.com/volkovlabs/business-forms/issues/59)).

### Changed

- Rebuilt based on 9.0.3 ([#58](https://github.com/volkovlabs/business-forms/issues/58)).
- Explained Custom code in README ([#60](https://github.com/volkovlabs/business-forms/issues/60)).
- Updated YouTube link with tutorial in README ([#61](https://github.com/volkovlabs/business-forms/issues/61)).

## [2.0.0] - 2022-06-17

### Breaking Changes

- Now requires Grafana 8.3+ and 9.0+.

### Changed

- Rebuilt based on 9.0.0 ([#53](https://github.com/volkovlabs/business-forms/issues/53)).

## [1.4.0] - 2022-05-30

### Added

- Introduced highlight for changed values ([#51](https://github.com/volkovlabs/business-forms/issues/51)).
- Added confirmation before Submit ([#52](https://github.com/volkovlabs/business-forms/issues/52)).

### Changed

- Allowed updating Element Width ([#50](https://github.com/volkovlabs/business-forms/issues/50)).

## [1.3.0] - 2022-05-22

### Added

- Introduced layout to have sections for Form Fields ([#47](https://github.com/volkovlabs/business-forms/issues/47)).
- Added None Request for Initial and Update requests ([#48](https://github.com/volkovlabs/business-forms/issues/48)).
- Introduced Code Editor Element for Configuration Forms ([#23](https://github.com/volkovlabs/business-forms/issues/23)).

### Changed

- Updated Architecture Diagram ([#44](https://github.com/volkovlabs/business-forms/issues/44)).
- Updated layout to have sections for Form Fields ([#47](https://github.com/volkovlabs/business-forms/issues/47)).

### Fixed

- Fixed changing colors on Submit not working properly ([#43](https://github.com/volkovlabs/business-forms/issues/43)).

## [1.2.0] - 2022-05-19

### Added

- Introduced Label Width and Tooltip ([#39](https://github.com/volkovlabs/business-forms/issues/39)).
- Added Server API with Postgres for Feedback Dashboard ([#36](https://github.com/volkovlabs/business-forms/issues/36)).
- Introduced Input Parameters to Form Elements ([#41](https://github.com/volkovlabs/business-forms/issues/41)).

## [1.1.0] - 2022-05-12

### Added

- Introduced Disabled Element ([#24](https://github.com/volkovlabs/business-forms/issues/24)).
- Added ability to move elements up and down ([#19](https://github.com/volkovlabs/business-forms/issues/19)).
- Introduced Split Disabled layout for Input/Output ([#27](https://github.com/volkovlabs/business-forms/issues/27)).
- Added Interpolate Variables ([#28](https://github.com/volkovlabs/business-forms/issues/28)).
- Introduced Min and Max for Numbers ([#29](https://github.com/volkovlabs/business-forms/issues/29)).
- Added Unit Label ([#31](https://github.com/volkovlabs/business-forms/issues/31)).
- Introduced Header Parameters ([#32](https://github.com/volkovlabs/business-forms/issues/32)).
- Added Password Input ([#33](https://github.com/volkovlabs/business-forms/issues/33)).
- Introduced Subscription to Refresh Events ([#30](https://github.com/volkovlabs/business-forms/issues/30)).

## [1.0.0] - 2022-05-11

### Added

- Initial release based on the Volkov Labs Panel template 1.5.0.
