# Change Log

## 3.7.0 (2024-03-10)

### Breaking changes

- Requires Grafana 9.2 and Grafana 10

### Features / Enhancements

- Added update enabled option and variables examples, fix sync option (#356)
- Added files upload examples and fix form data header (#357)
- Added code parameters with builder and add initial request to element value changed code (#358)
- Allowed to disable columns in confirmation modal (#360)
- Updated dependencies and Actions (#368)
- Added skipping elements hidden using Show If from update payload (#369)
- Add multiple files option (#375)

## 3.6.0 (2023-01-10)

### Features / Enhancements

- Added backend service to custom code (#331)
- Added support for file base64 encoding in payload (#331)
- Added Context parameter to Payload (#331)

### Bugfixes

- Fixed element custom options source (#334)

## 3.5.0 (2023-01-04)

### Features / Enhancements

- Added disable if code (#321)
- Updated reset request visibility if reset button is hidden (#322)
- Added code options source for select element (#323)
- Added value changed code (#324)
- Updated to Node 20 (#326)
- Added suggestions for code editors (#327)
- Added reset button confirmation (#328)

## 3.4.0 (2023-12-14)

### Features / Enhancements

- Add ability to disable panel syncing (#298)
- Update ESLint configuration and refactor (#299)
- Update Collapse from @volkovlabs/components (#299)
- Add EventBus and AppEvents to Context (#307)
- Add replacing variables in Payload functions (#309)
- Update to Grafana 10.2.2 and Volkov labs packages (#313)
- Add options migration (#315)

### Bugfixes

- Fix draggable control to support upcoming Grafana changes (#314)

## 3.3.0 (2023-11-21)

### Features / Enhancements

- Add Disabled Text Area element type (#243)
- Add Confirmation Window options (#242)
- Add context object to the custom code (#255)
- Add Select Options From Query (#254)
- Add NumberInput component which allows to enter decimals (#291)
- Update to Plugin Tools 2.1.1 (#292)
- Use Grafana Access Policy to sign plugin (#292)
- Update to Grafana 10.2.1 (#292)
- Update ESLint configuration (#294)
- Add Autosize Code Editor (#295)
- Add Data Source option for Reset button (#296)
- Add Link Element (#297)

### Bugfixes

- Allow to enter zero value in number field (#288)

## 3.2.1 (2023-09-07)

### Features / Enhancements

- Add backward compatibility for option id (#244)

## 3.2.0 (2023-09-06)

### Features / Enhancements

- Add min and max date for date time element (#225)
- Map Data Source values to elements (#224)
- Update element Show If to support variables (#230)
- Add clearing errors before initial and update requests (#232)
- Add URL encode to variables (#231)
- Allow empty section name (#228)
- Add Query Field Picker for Initial Request (#227)
- Add File element type for File Upload (#229)
- Add converting option value to string and number based on type (#233)
- Add loading states for Initial, Update and Reset button actions (#234)
- Add support for asynchronous custom code (#234)
- Update Query and Data Source initial request (#237)
- Add icons for radio and select options (#238)

## 3.1.0 (2023-08-13)

### Features / Enhancements

- Update jest selectors to use npm package (#209)
- Add onChange to update elements in local state within custom code (#214)
- Update ESLint configuration (#215)
- Add Multi Select element (#217)
- Add conditional element visibility (#219)
- Add custom payload code editor (#220)
- Add custom reset code editor (#221)
- Add Data Source request (#222)

## 3.0.0 (2023-07-15)

## Breaking changes

- Requires Grafana 9 and Grafana 10.
- Form Elements are kept in the local state and not saved in the dashboard by default.
- Local states and elements refactoring may introduce breaking changes. Please test before using in Production.

### Features / Enhancements

- Update Documentation for API Servers (#149)
- Update to Grafana 10.0.0 (#165, #172, #184, #200)
- Add Hidden option to String element (#171)
- Add E2E Cypress testing (#180)
- Increase Test Coverage and update Test library (#181, #183, #185)
- Update Form Elements to delay save changes with auto-save (#186)
- Migrate to Plugin Tools 1.5.2 (#187, #192)
- Update to Node 18 (#188)
- Update constants and E2E tests (#190)
- Update Form elements to use local state (#191)
- Add notifyWarning() function (#201)
- Add drag and drop for elements editor (#202)
- Remove Grafana 8.5 support (#203)
- Add running initial request on initial updates (#205)
- Add vertical layout orientation (#206)

## 2.8.0 (2023-03-16)

### Features / Enhancements

- Add String, Number Type for Select and Radio options (#120)
- Add Lookup options for Disabled element (#121)
- Add Server API with MYSQL for Feedback Dashboard (#125)
- Update to Grafana 9.3.1 (#129)
- Add Option for DELETE request (#130)
- Add "Buttons only" Layout to do GET/POST/DELETE requests (#131)
- Update README and move Documentation to docs.volkovlabs.io (#132)
- Update README and Documentation (#134)
- Refactor API Servers (#128)
- Update CI and Release workflows (#145)
- Update to Grafana 9.4.3 (#146)
- Add NoPadding to remove extra padding around and make it configurable (#146)
- Update README and Documentation (#147)

### Bug fixes

- Fix Password and Boolean elements confirmation (#120)

## 2.7.0 (2022-11-10)

### Features / Enhancements

- Update to Grafana 9.2.2 (#113)
- Update CI to upload signed artifacts (#116)
- Allow to send all or updated only values in Payload (#116)
- Add Initial values parameter to Update Request parameters (#117)
- Add Status notification after submit form (#98)
- Add Monaco Code Editor suggestions for available parameters (#88)

## 2.6.0 (2022-10-23)

### Features / Enhancements

- Add Compatibility Check Workflow (#92)
- Update to Grafana 9.1.6 (#92)
- Add Custom Code to update variable after update request (#106)
- Add Number Input and Slider min, max validation (#95)
- Initialize element value from a Data Source query (#105)
- Update CI to Node 16 and Synchronize with Release workflow (#109)

### Bug fixes

- Initial GET request date time formatting (#99)

## 2.5.0 (2022-09-10)

### Features / Enhancements

- Add Request Header check (#85)
- Expose `initialRequest()` in Custom Code to reload panel (#89)
- Set `json` as response data from Initial Request (#90)
- Update to Grafana 9.1.4 (#91)

## 2.4.0 (2022-08-31)

### Features / Enhancements

- Update to Grafana 9.1.1 (#72)
- Explain how to use Dashboard Variables in README (#73)
- Add onOptionsChange in examples to update the panel (#75)
- Add variables in URL to call from form elements (#78)
- Add Custom Update Request to README (#79)
- Add Deno Deploy Playground server and dashboard (#80)
- Add "How to Manipulate Data using Grafana dashboard" video in README (#80)
- Show Title instead of Id in the Confirmation Panel (#81)
- Avoid showing confirmation for disabled elements (#77)
- Improve Test Coverage (#21)

## 2.3.0 (2022-08-11)

### Breaking changes

- Signed as Community Plugin.

### Features / Enhancements

- Update Sample code in README (#67)
- Updated to be included in the Grafana Marketplace (#68)

## 2.2.0 (2022-08-09)

### Features / Enhancements

- Update to Grafana 9.0.6 (#63)
- Allow to get Elements Initial Value and Configuration from Data Source (#22)
- Update Alert when no elements defined (#66)

### Bug fixes

- Number Slider is not updated properly (#18)

## 2.1.0 (2022-07-17)

### Features / Enhancements

- Rebuild based on 9.0.3 (#58)
- Automatic Code Editor Formatting (#59)
- Explain Custom code in Readme (#60)
- Update YouTube link with tutorial in README #61

## 2.0.0 (2022-06-17)

### Breaking changes

- Requires Grafana 8.3+ and 9.0+

### Features / Enhancements

- Rebuild based on 9.0.0 (#53)

## 1.4.0 (2022-05-30)

### Features / Enhancements

- Allow to update Element Width (#50)
- Add Highlight for changed values (#51)
- Add Confirmation before Submit (#52)

## 1.3.0 (2022-05-22)

### Features / Enhancements

- Update Architecture Diagram (#44)
- Changing colors on Submit is not working properly (#43)
- Update layout to have sections for Form Fields (#47)
- Add None Request for Initial and Update requests (#48)
- Add Code Editor Element for Configuration Forms (#23)

## 1.2.0 (2022-05-19)

### Features / Enhancements

- Add Label Width and Tooltip (#39)
- Add Server API with Postgres for Feedback Dashboard (#36)
- Update Input Parameters to Form Elements (#41)

## 1.1.0 (2022-05-12)

### Features / Enhancements

- Added Disabled Element (#24)
- Added ability to move elements up and down (#19)
- Added Split Disabled layout for Input/Output (#27)
- Added Interpolate Variables (#28)
- Added Min and Max for Numbers (#29)
- Added Unit Label (#31)
- Added Header Parameters (#32)
- Added Password Input (#33)
- Subscribed to Refresh Events (#30)

## 1.0.0 (2022-05-11)

### Features / Enhancements

- Initial release based on the Volkov Labs Panel template 1.5.0
