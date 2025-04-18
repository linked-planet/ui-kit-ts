const e=`
html[data-color-mode="light"][data-theme~="light:dark-increased-contrast"],
html[data-color-mode="dark"][data-theme~="dark:dark-increased-contrast"],
html[data-color-mode="light"][data-contrast-mode="more"][data-theme~="light:dark"],
html[data-color-mode="dark"][data-contrast-mode="more"][data-theme~="dark:dark"] {
  color-scheme: dark;
  --ds-text: #DEE4EA;
  --ds-text-accent-lime: #D3F1A7;
  --ds-text-accent-lime-bolder: #EFFFD6;
  --ds-text-accent-red: #FFD5D2;
  --ds-text-accent-red-bolder: #FFECEB;
  --ds-text-accent-orange: #FEDEC8;
  --ds-text-accent-orange-bolder: #FFF3EB;
  --ds-text-accent-yellow: #F8E6A0;
  --ds-text-accent-yellow-bolder: #FFF7D6;
  --ds-text-accent-green: #BAF3DB;
  --ds-text-accent-green-bolder: #DCFFF1;
  --ds-text-accent-teal: #C6EDFB;
  --ds-text-accent-teal-bolder: #E7F9FF;
  --ds-text-accent-blue: #CCE0FF;
  --ds-text-accent-blue-bolder: #E9F2FF;
  --ds-text-accent-purple: #DFD8FD;
  --ds-text-accent-purple-bolder: #F3F0FF;
  --ds-text-accent-magenta: #FDD0EC;
  --ds-text-accent-magenta-bolder: #FFECF8;
  --ds-text-accent-gray: #B6C2CF;
  --ds-text-accent-gray-bolder: #DEE4EA;
  --ds-text-disabled: #BFDBF847;
  --ds-text-inverse: #1D2125;
  --ds-text-selected: #CCE0FF;
  --ds-text-brand: #CCE0FF;
  --ds-text-danger: #FFD5D2;
  --ds-text-warning: #FEDEC8;
  --ds-text-warning-inverse: #161A1D;
  --ds-text-success: #BAF3DB;
  --ds-text-discovery: #DFD8FD;
  --ds-text-information: #CCE0FF;
  --ds-text-subtlest: #B6C2CF;
  --ds-text-subtle: #C7D1DB;
  --ds-link: #CCE0FF;
  --ds-link-pressed: #CCE0FF;
  --ds-link-visited: #B8ACF6;
  --ds-link-visited-pressed: #DFD8FD;
  --ds-icon: #C7D1DB;
  --ds-icon-accent-lime: #B3DF72;
  --ds-icon-accent-red: #FD9891;
  --ds-icon-accent-orange: #FEC195;
  --ds-icon-accent-yellow: #F5CD47;
  --ds-icon-accent-green: #7EE2B8;
  --ds-icon-accent-teal: #9DD9EE;
  --ds-icon-accent-blue: #85B8FF;
  --ds-icon-accent-purple: #B8ACF6;
  --ds-icon-accent-magenta: #F797D2;
  --ds-icon-accent-gray: #9FADBC;
  --ds-icon-disabled: #BFDBF847;
  --ds-icon-inverse: #1D2125;
  --ds-icon-selected: #85B8FF;
  --ds-icon-brand: #85B8FF;
  --ds-icon-danger: #F87168;
  --ds-icon-warning: #FEC195;
  --ds-icon-warning-inverse: #161A1D;
  --ds-icon-success: #7EE2B8;
  --ds-icon-discovery: #9F8FEF;
  --ds-icon-information: #85B8FF;
  --ds-icon-subtlest: #B6C2CF;
  --ds-icon-subtle: #B6C2CF;
  --ds-border: #9BB4CA80;
  --ds-border-accent-lime: #B3DF72;
  --ds-border-accent-red: #FD9891;
  --ds-border-accent-orange: #FEC195;
  --ds-border-accent-yellow: #F5CD47;
  --ds-border-accent-green: #7EE2B8;
  --ds-border-accent-teal: #9DD9EE;
  --ds-border-accent-blue: #85B8FF;
  --ds-border-accent-purple: #B8ACF6;
  --ds-border-accent-magenta: #F797D2;
  --ds-border-accent-gray: #9FADBC;
  --ds-border-disabled: #A6C5E229;
  --ds-border-focused: #85B8FF;
  --ds-border-input: #9FADBC;
  --ds-border-inverse: #161A1D;
  --ds-border-selected: #85B8FF;
  --ds-border-brand: #85B8FF;
  --ds-border-danger: #F87168;
  --ds-border-warning: #FEC195;
  --ds-border-success: #7EE2B8;
  --ds-border-discovery: #9F8FEF;
  --ds-border-information: #85B8FF;
  --ds-border-bold: #9FADBC;
  --ds-background-accent-lime-subtlest: #28311B;
  --ds-background-accent-lime-subtlest-hovered: #37471F;
  --ds-background-accent-lime-subtlest-pressed: #4C6B1F;
  --ds-background-accent-lime-subtler: #37471F;
  --ds-background-accent-lime-subtler-hovered: #4C6B1F;
  --ds-background-accent-lime-subtler-pressed: #5B7F24;
  --ds-background-accent-lime-subtle: #4C6B1F;
  --ds-background-accent-lime-subtle-hovered: #37471F;
  --ds-background-accent-lime-subtle-pressed: #28311B;
  --ds-background-accent-lime-bolder: #D3F1A7;
  --ds-background-accent-lime-bolder-hovered: #EFFFD6;
  --ds-background-accent-lime-bolder-pressed: #D3F1A7;
  --ds-background-accent-red-subtlest: #42221F;
  --ds-background-accent-red-subtlest-hovered: #5D1F1A;
  --ds-background-accent-red-subtlest-pressed: #AE2E24;
  --ds-background-accent-red-subtler: #5D1F1A;
  --ds-background-accent-red-subtler-hovered: #AE2E24;
  --ds-background-accent-red-subtler-pressed: #C9372C;
  --ds-background-accent-red-subtle: #AE2E24;
  --ds-background-accent-red-subtle-hovered: #5D1F1A;
  --ds-background-accent-red-subtle-pressed: #42221F;
  --ds-background-accent-red-bolder: #FFD5D2;
  --ds-background-accent-red-bolder-hovered: #FFECEB;
  --ds-background-accent-red-bolder-pressed: #FFD5D2;
  --ds-background-accent-orange-subtlest: #38291E;
  --ds-background-accent-orange-subtlest-hovered: #702E00;
  --ds-background-accent-orange-subtlest-pressed: #A54800;
  --ds-background-accent-orange-subtler: #702E00;
  --ds-background-accent-orange-subtler-hovered: #A54800;
  --ds-background-accent-orange-subtler-pressed: #C25100;
  --ds-background-accent-orange-subtle: #A54800;
  --ds-background-accent-orange-subtle-hovered: #702E00;
  --ds-background-accent-orange-subtle-pressed: #38291E;
  --ds-background-accent-orange-bolder: #FEDEC8;
  --ds-background-accent-orange-bolder-hovered: #FFF3EB;
  --ds-background-accent-orange-bolder-pressed: #FEDEC8;
  --ds-background-accent-yellow-subtlest: #332E1B;
  --ds-background-accent-yellow-subtlest-hovered: #533F04;
  --ds-background-accent-yellow-subtlest-pressed: #7F5F01;
  --ds-background-accent-yellow-subtler: #533F04;
  --ds-background-accent-yellow-subtler-hovered: #7F5F01;
  --ds-background-accent-yellow-subtler-pressed: #946F00;
  --ds-background-accent-yellow-subtle: #7F5F01;
  --ds-background-accent-yellow-subtle-hovered: #533F04;
  --ds-background-accent-yellow-subtle-pressed: #332E1B;
  --ds-background-accent-yellow-bolder: #F8E6A0;
  --ds-background-accent-yellow-bolder-hovered: #FFF7D6;
  --ds-background-accent-yellow-bolder-pressed: #F8E6A0;
  --ds-background-accent-green-subtlest: #1C3329;
  --ds-background-accent-green-subtlest-hovered: #164B35;
  --ds-background-accent-green-subtlest-pressed: #216E4E;
  --ds-background-accent-green-subtler: #164B35;
  --ds-background-accent-green-subtler-hovered: #216E4E;
  --ds-background-accent-green-subtler-pressed: #1F845A;
  --ds-background-accent-green-subtle: #216E4E;
  --ds-background-accent-green-subtle-hovered: #164B35;
  --ds-background-accent-green-subtle-pressed: #1C3329;
  --ds-background-accent-green-bolder: #BAF3DB;
  --ds-background-accent-green-bolder-hovered: #DCFFF1;
  --ds-background-accent-green-bolder-pressed: #BAF3DB;
  --ds-background-accent-teal-subtlest: #1E3137;
  --ds-background-accent-teal-subtlest-hovered: #164555;
  --ds-background-accent-teal-subtlest-pressed: #206A83;
  --ds-background-accent-teal-subtler: #164555;
  --ds-background-accent-teal-subtler-hovered: #206A83;
  --ds-background-accent-teal-subtler-pressed: #227D9B;
  --ds-background-accent-teal-subtle: #206A83;
  --ds-background-accent-teal-subtle-hovered: #164555;
  --ds-background-accent-teal-subtle-pressed: #1E3137;
  --ds-background-accent-teal-bolder: #C6EDFB;
  --ds-background-accent-teal-bolder-hovered: #E7F9FF;
  --ds-background-accent-teal-bolder-pressed: #C6EDFB;
  --ds-background-accent-blue-subtlest: #1C2B41;
  --ds-background-accent-blue-subtlest-hovered: #09326C;
  --ds-background-accent-blue-subtlest-pressed: #0055CC;
  --ds-background-accent-blue-subtler: #09326C;
  --ds-background-accent-blue-subtler-hovered: #0055CC;
  --ds-background-accent-blue-subtler-pressed: #0C66E4;
  --ds-background-accent-blue-subtle: #0055CC;
  --ds-background-accent-blue-subtle-hovered: #09326C;
  --ds-background-accent-blue-subtle-pressed: #1C2B41;
  --ds-background-accent-blue-bolder: #579DFF;
  --ds-background-accent-blue-bolder-hovered: #85B8FF;
  --ds-background-accent-blue-bolder-pressed: #CCE0FF;
  --ds-background-accent-purple-subtlest: #2B273F;
  --ds-background-accent-purple-subtlest-hovered: #352C63;
  --ds-background-accent-purple-subtlest-pressed: #5E4DB2;
  --ds-background-accent-purple-subtler: #352C63;
  --ds-background-accent-purple-subtler-hovered: #5E4DB2;
  --ds-background-accent-purple-subtler-pressed: #6E5DC6;
  --ds-background-accent-purple-subtle: #5E4DB2;
  --ds-background-accent-purple-subtle-hovered: #352C63;
  --ds-background-accent-purple-subtle-pressed: #2B273F;
  --ds-background-accent-purple-bolder: #DFD8FD;
  --ds-background-accent-purple-bolder-hovered: #F3F0FF;
  --ds-background-accent-purple-bolder-pressed: #DFD8FD;
  --ds-background-accent-magenta-subtlest: #3D2232;
  --ds-background-accent-magenta-subtlest-hovered: #50253F;
  --ds-background-accent-magenta-subtlest-pressed: #943D73;
  --ds-background-accent-magenta-subtler: #50253F;
  --ds-background-accent-magenta-subtler-hovered: #943D73;
  --ds-background-accent-magenta-subtler-pressed: #AE4787;
  --ds-background-accent-magenta-subtle: #943D73;
  --ds-background-accent-magenta-subtle-hovered: #50253F;
  --ds-background-accent-magenta-subtle-pressed: #3D2232;
  --ds-background-accent-magenta-bolder: #FDD0EC;
  --ds-background-accent-magenta-bolder-hovered: #FFECF8;
  --ds-background-accent-magenta-bolder-pressed: #FDD0EC;
  --ds-background-accent-gray-subtlest: #2C333A;
  --ds-background-accent-gray-subtlest-hovered: #38414A;
  --ds-background-accent-gray-subtlest-pressed: #454F59;
  --ds-background-accent-gray-subtler: #454F59;
  --ds-background-accent-gray-subtler-hovered: #596773;
  --ds-background-accent-gray-subtler-pressed: #738496;
  --ds-background-accent-gray-subtle: #454F59;
  --ds-background-accent-gray-subtle-hovered: #2C333A;
  --ds-background-accent-gray-subtle-pressed: #22272B;
  --ds-background-accent-gray-bolder: #9FADBC;
  --ds-background-accent-gray-bolder-hovered: #B6C2CF;
  --ds-background-accent-gray-bolder-pressed: #C7D1DB;
  --ds-background-disabled: #BCD6F00A;
  --ds-background-input: #22272B;
  --ds-background-input-hovered: #282E33;
  --ds-background-input-pressed: #22272B;
  --ds-background-inverse-subtle: #FFFFFF29;
  --ds-background-inverse-subtle-hovered: #FFFFFF3D;
  --ds-background-inverse-subtle-pressed: #FFFFFF52;
  --ds-background-neutral: #A1BDD914;
  --ds-background-neutral-hovered: #A6C5E229;
  --ds-background-neutral-pressed: #BFDBF847;
  --ds-background-neutral-subtle: #00000000;
  --ds-background-neutral-subtle-hovered: #A1BDD914;
  --ds-background-neutral-subtle-pressed: #A6C5E229;
  --ds-background-neutral-bold: #9FADBC;
  --ds-background-neutral-bold-hovered: #B6C2CF;
  --ds-background-neutral-bold-pressed: #C7D1DB;
  --ds-background-selected: #1C2B41;
  --ds-background-selected-hovered: #09326C;
  --ds-background-selected-pressed: #0055CC;
  --ds-background-selected-bold: #CCE0FF;
  --ds-background-selected-bold-hovered: #E9F2FF;
  --ds-background-selected-bold-pressed: #DEE4EA;
  --ds-background-brand-subtlest: #1C2B41;
  --ds-background-brand-subtlest-hovered: #09326C;
  --ds-background-brand-subtlest-pressed: #0055CC;
  --ds-background-brand-bold: #CCE0FF;
  --ds-background-brand-bold-hovered: #E9F2FF;
  --ds-background-brand-bold-pressed: #DEE4EA;
  --ds-background-brand-boldest: #E9F2FF;
  --ds-background-brand-boldest-hovered: #CCE0FF;
  --ds-background-brand-boldest-pressed: #85B8FF;
  --ds-background-danger: #42221F;
  --ds-background-danger-hovered: #5D1F1A;
  --ds-background-danger-pressed: #AE2E24;
  --ds-background-danger-bold: #FFD5D2;
  --ds-background-danger-bold-hovered: #FFECEB;
  --ds-background-danger-bold-pressed: #DEE4EA;
  --ds-background-warning: #332E1B;
  --ds-background-warning-hovered: #533F04;
  --ds-background-warning-pressed: #7F5F01;
  --ds-background-warning-bold: #F8E6A0;
  --ds-background-warning-bold-hovered: #FFF7D6;
  --ds-background-warning-bold-pressed: #DEE4EA;
  --ds-background-success: #1C3329;
  --ds-background-success-hovered: #164B35;
  --ds-background-success-pressed: #216E4E;
  --ds-background-success-bold: #BAF3DB;
  --ds-background-success-bold-hovered: #DCFFF1;
  --ds-background-success-bold-pressed: #DEE4EA;
  --ds-background-discovery: #2B273F;
  --ds-background-discovery-hovered: #352C63;
  --ds-background-discovery-pressed: #5E4DB2;
  --ds-background-discovery-bold: #DFD8FD;
  --ds-background-discovery-bold-hovered: #F3F0FF;
  --ds-background-discovery-bold-pressed: #DEE4EA;
  --ds-background-information: #1C2B41;
  --ds-background-information-hovered: #09326C;
  --ds-background-information-pressed: #0055CC;
  --ds-background-information-bold: #CCE0FF;
  --ds-background-information-bold-hovered: #E9F2FF;
  --ds-background-information-bold-pressed: #DEE4EA;
  --ds-blanket: #10121499;
  --ds-blanket-selected: #1D7AFC14;
  --ds-blanket-danger: #E3493514;
  --ds-interaction-hovered: #ffffff33;
  --ds-interaction-pressed: #ffffff5c;
  --ds-skeleton: #A1BDD914;
  --ds-skeleton-subtle: #BCD6F00A;
  --ds-chart-categorical-1: #9DD9EE;
  --ds-chart-categorical-1-hovered: #C6EDFB;
  --ds-chart-categorical-2: #B8ACF6;
  --ds-chart-categorical-2-hovered: #DFD8FD;
  --ds-chart-categorical-3: #FEC195;
  --ds-chart-categorical-3-hovered: #FEDEC8;
  --ds-chart-categorical-4: #F797D2;
  --ds-chart-categorical-4-hovered: #FDD0EC;
  --ds-chart-categorical-5: #CCE0FF;
  --ds-chart-categorical-5-hovered: #E9F2FF;
  --ds-chart-categorical-6: #B8ACF6;
  --ds-chart-categorical-6-hovered: #DFD8FD;
  --ds-chart-categorical-7: #FDD0EC;
  --ds-chart-categorical-7-hovered: #FFECF8;
  --ds-chart-categorical-8: #FEC195;
  --ds-chart-categorical-8-hovered: #FEDEC8;
  --ds-chart-lime-bold: #B3DF72;
  --ds-chart-lime-bold-hovered: #D3F1A7;
  --ds-chart-lime-bolder: #D3F1A7;
  --ds-chart-lime-bolder-hovered: #EFFFD6;
  --ds-chart-lime-boldest: #EFFFD6;
  --ds-chart-lime-boldest-hovered: #D3F1A7;
  --ds-chart-neutral: #8C9BAB;
  --ds-chart-neutral-hovered: #9FADBC;
  --ds-chart-red-bold: #FD9891;
  --ds-chart-red-bold-hovered: #FFD5D2;
  --ds-chart-red-bolder: #FFD5D2;
  --ds-chart-red-bolder-hovered: #FFECEB;
  --ds-chart-red-boldest: #FFECEB;
  --ds-chart-red-boldest-hovered: #FFD5D2;
  --ds-chart-orange-bold: #FEC195;
  --ds-chart-orange-bold-hovered: #FEDEC8;
  --ds-chart-orange-bolder: #FEDEC8;
  --ds-chart-orange-bolder-hovered: #FFF3EB;
  --ds-chart-orange-boldest: #FFF3EB;
  --ds-chart-orange-boldest-hovered: #FEDEC8;
  --ds-chart-yellow-bold: #F5CD47;
  --ds-chart-yellow-bold-hovered: #F8E6A0;
  --ds-chart-yellow-bolder: #F8E6A0;
  --ds-chart-yellow-bolder-hovered: #FFF7D6;
  --ds-chart-yellow-boldest: #FFF7D6;
  --ds-chart-yellow-boldest-hovered: #F8E6A0;
  --ds-chart-green-bold: #7EE2B8;
  --ds-chart-green-bold-hovered: #4BCE97;
  --ds-chart-green-bolder: #BAF3DB;
  --ds-chart-green-bolder-hovered: #DCFFF1;
  --ds-chart-green-boldest: #DCFFF1;
  --ds-chart-green-boldest-hovered: #BAF3DB;
  --ds-chart-teal-bold: #9DD9EE;
  --ds-chart-teal-bold-hovered: #C6EDFB;
  --ds-chart-teal-bolder: #C6EDFB;
  --ds-chart-teal-bolder-hovered: #E7F9FF;
  --ds-chart-teal-boldest: #E7F9FF;
  --ds-chart-teal-boldest-hovered: #C6EDFB;
  --ds-chart-blue-bold: #85B8FF;
  --ds-chart-blue-bold-hovered: #CCE0FF;
  --ds-chart-blue-bolder: #CCE0FF;
  --ds-chart-blue-bolder-hovered: #E9F2FF;
  --ds-chart-blue-boldest: #E9F2FF;
  --ds-chart-blue-boldest-hovered: #CCE0FF;
  --ds-chart-purple-bold: #B8ACF6;
  --ds-chart-purple-bold-hovered: #DFD8FD;
  --ds-chart-purple-bolder: #DFD8FD;
  --ds-chart-purple-bolder-hovered: #F3F0FF;
  --ds-chart-purple-boldest: #F3F0FF;
  --ds-chart-purple-boldest-hovered: #DFD8FD;
  --ds-chart-magenta-bold: #F797D2;
  --ds-chart-magenta-bold-hovered: #FDD0EC;
  --ds-chart-magenta-bolder: #FDD0EC;
  --ds-chart-magenta-bolder-hovered: #FFECF8;
  --ds-chart-magenta-boldest: #FFECF8;
  --ds-chart-magenta-boldest-hovered: #FDD0EC;
  --ds-chart-gray-bold: #8C9BAB;
  --ds-chart-gray-bold-hovered: #9FADBC;
  --ds-chart-gray-bolder: #9FADBC;
  --ds-chart-gray-bolder-hovered: #B6C2CF;
  --ds-chart-gray-boldest: #B6C2CF;
  --ds-chart-gray-boldest-hovered: #C7D1DB;
  --ds-chart-brand: #579DFF;
  --ds-chart-brand-hovered: #85B8FF;
  --ds-chart-danger: #F87168;
  --ds-chart-danger-hovered: #F15B50;
  --ds-chart-danger-bold: #FD9891;
  --ds-chart-danger-bold-hovered: #FFD5D2;
  --ds-chart-warning: #CF9F02;
  --ds-chart-warning-hovered: #E2B203;
  --ds-chart-warning-bold: #F5CD47;
  --ds-chart-warning-bold-hovered: #F8E6A0;
  --ds-chart-success: #2ABB7F;
  --ds-chart-success-hovered: #4BCE97;
  --ds-chart-success-bold: #7EE2B8;
  --ds-chart-success-bold-hovered: #BAF3DB;
  --ds-chart-discovery: #9F8FEF;
  --ds-chart-discovery-hovered: #8F7EE7;
  --ds-chart-discovery-bold: #B8ACF6;
  --ds-chart-discovery-bold-hovered: #DFD8FD;
  --ds-chart-information: #579DFF;
  --ds-chart-information-hovered: #388BFF;
  --ds-chart-information-bold: #85B8FF;
  --ds-chart-information-bold-hovered: #CCE0FF;
  --ds-surface: #1D2125;
  --ds-surface-hovered: #22272B;
  --ds-surface-pressed: #282E33;
  --ds-surface-overlay: #282E33;
  --ds-surface-overlay-hovered: #2C333A;
  --ds-surface-overlay-pressed: #38414A;
  --ds-surface-raised: #22272B;
  --ds-surface-raised-hovered: #282E33;
  --ds-surface-raised-pressed: #2C333A;
  --ds-surface-sunken: #161A1D;
  --ds-shadow-overflow: 0px 0px 12px #0304048F;
  --ds-shadow-overflow-perimeter: #03040480;
  --ds-shadow-overflow-spread: #0304048f;
  --ds-shadow-overlay: inset 0px 0px 0px 1px #9BB4CA80;
  --ds-shadow-raised: inset 0px 0px 0px 1px #9BB4CA80;
  --ds-opacity-disabled: 0.4;
  --ds-opacity-loading: 0.2;
  --ds-UNSAFE-transparent: transparent;
  --ds-elevation-surface-current: #1D2125;
}
`;export{e as default};
