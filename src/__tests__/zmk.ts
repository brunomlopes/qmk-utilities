import { existing_layouts, straight_keymap } from "code/layouts";
import {
  parse_layouts_from_keymap_content,
  print_ascii_keymap_zmk,
  print_keymaps_zmk,
} from "code/zmk";

let reviung41_layout = existing_layouts.find((l) => l.name == "Reviung41");

let two_by_two_layout = {
  name: "two_by_two",
  keymap_layout: straight_keymap(2, 2),
  keymap_layout_markers: ["LAYOUT("],
};

describe(`ZMK Parser`, () => {
  it("Parses a reviung41 keymap with a single layer", () => {
    let layouts = [
      ...parse_layouts_from_keymap_content(`
        default_layer {
            bindings = <
              &mt LALT ESC    &kp Q   &kp W   &kp E   &kp R       &kp T                       &kp Y       &kp U      &kp I       &kp O     &kp P      &mt LALT RBRC
              &mt LCTRL TAB   &kp A   &kp S   &kp D   &kp F       &kp G                       &kp H       &kp J      &kp K       &kp L     &kp RET    &mt RCTL BSPC
              &kp LSHFT       &kp Z   &kp X   &kp C   &kp V       &kp B                       &kp N       &kp M      &kp COMMA   &kp DOT   &kp FSLH   &kp RSHFT
                                                      &kp LCTRL   &mo LOWER   &lt SPACE NAV   &mo RAISE   &kp LALT
            >;
          };  
        `),
    ];
    expect(layouts.length).toBe(1);
    let layout = layouts[0];
    expect(layout.name).toBe("default_layer");
    expect(layout.keys.length).toBe(41);
    expect(layout.keys.slice(12, 24)).toEqual([
      "&mt LCTRL TAB",
      "&kp A",
      "&kp S",
      "&kp D",
      "&kp F",
      "&kp G",
      "&kp H",
      "&kp J",
      "&kp K",
      "&kp L",
      "&kp RET",
      "&mt RCTL BSPC",
    ]);
  });

  it("Parses a reviung41 keymap with two layers and comments in the middle", () => {
    let layouts = [
      ...parse_layouts_from_keymap_content(`

      lower_layer {
        bindings = <
          &trans   &kp N1      &kp N2      &kp N3     &kp N4     &kp N5                &kp N6   &kp N7   &kp N8   &kp N9    &kp N0    &trans  
          &trans   &kp EXCL    &kp AT        &kp HASH   &kp DLLR   &kp PRCNT             &kp CARET   &kp AMPS   &kp N8      &kp LPAR    &kp RPAR    &kp DEL
          &trans   &kp MINUS   &kp KP_PLUS   &kp LBRC   &kp RBRC   &kp PIPE              &kp LEFT    &kp DOWN   &kp UP      &kp RIGHT   &kp GRAVE   &kp TILDE 
                                                        &trans     &trans      &kp RET   &mo 3       &trans
        >;
                    };
    
                    raise_layer {
    // -----------------------------------------------------------------------------------------
    // |    |  1  |  2  |  3  |  4  |  5  |   |  6  |  7  |  8  |  9  |  0  | DEL |
    // |    |  -  |  =  |  [  |  ]  |  \  |   | F1  | F2  | F3  | F4  | F5  | F6  |
    // |    | ESC | GUI | ALT | CAPS|  "  |   | F7  | F8  | F9  | F10 | F11 | F12 |
    //                       |     | ADJ | BKSP |    |     |
    bindings = <
          &trans   &kp N1      &kp N2      &kp N3     &kp N4     &kp N5                &kp N6   &kp N7   &kp N8   &kp N9    &kp N0    &kp DEL  
          &trans   &kp MINUS   &kp EQUAL   &kp LBKT   &kp RBKT   &kp BSLH              &kp F1   &kp F2   &kp F3   &kp F4    &kp F5    &kp F6   
          &trans   &kp ESC     &kp LGUI    &kp RALT   &kp CLCK   &kp DQT               &kp F7   &kp F8   &kp F9   &kp F10   &kp F11   &kp F12  
                                                      &trans     &mo 3      &kp BSPC   &trans   &trans                                        
        >;
                    };
        `),
    ];
    expect(layouts.length).toBe(2);
    expect(layouts.map((l) => l.name)).toStrictEqual([
      "lower_layer",
      "raise_layer",
    ]);
    expect(layouts.map((l) => l.keys.length)).toStrictEqual([41, 41]);
  });
});

describe("ZMK Render", () => {
  it("Renders two layouts correctly", () => {
    let layouts = [
      ...parse_layouts_from_keymap_content(`
      
            lower_layer {
              bindings = <
                &trans   &kp N1      &kp N2      &kp N3     &kp N4     &kp N5                &kp N6   &kp N7   &kp N8   &kp N9    &kp N0    &trans  
                &trans   &kp EXCL    &kp AT        &kp HASH   &kp DLLR   &kp PRCNT             &kp CARET   &kp AMPS   &kp N8      &kp LPAR    &kp RPAR    &kp DEL
                &trans   &kp MINUS   &kp KP_PLUS   &kp LBRC   &kp RBRC   &kp PIPE              &kp LEFT    &kp DOWN   &kp UP      &kp RIGHT   &kp GRAVE   &kp TILDE 
                                                              &trans     &trans      &kp RET   &mo 3       &trans
              >;
                          };
          
                          raise_layer {
          // -----------------------------------------------------------------------------------------
          // |    |  1  |  2  |  3  |  4  |  5  |   |  6  |  7  |  8  |  9  |  0  | DEL |
          // |    |  -  |  =  |  [  |  ]  |  \  |   | F1  | F2  | F3  | F4  | F5  | F6  |
          // |    | ESC | GUI | ALT | CAPS|  "  |   | F7  | F8  | F9  | F10 | F11 | F12 |
          //                       |     | ADJ | BKSP |    |     |
          bindings = <
                &trans   &kp N1      &kp N2      &kp N3     &kp N4     &kp N5                &kp N6   &kp N7   &kp N8   &kp N9    &kp N0    &kp DEL  
                &trans   &kp MINUS   &kp EQUAL   &kp LBKT   &kp RBKT   &kp BSLH              &kp F1   &kp F2   &kp F3   &kp F4    &kp F5    &kp F6   
                &trans   &kp ESC     &kp LGUI    &kp RALT   &kp CLCK   &kp DQT               &kp F7   &kp F8   &kp F9   &kp F10   &kp F11   &kp F12  
                                                            &trans     &mo 3      &kp BSPC   &trans   &trans                                        
              >;
                          };
              `),
    ];

    let rendered_layout = print_keymaps_zmk(
      layouts,
      reviung41_layout.keymap_layout,
      false
    );
    expect(rendered_layout).toBe(`  lower_layer {
    bindings = <
      &trans   &kp N1      &kp N2        &kp N3     &kp N4     &kp N5                &kp N6      &kp N7     &kp N8   &kp N9      &kp N0      &trans     
      &trans   &kp EXCL    &kp AT        &kp HASH   &kp DLLR   &kp PRCNT             &kp CARET   &kp AMPS   &kp N8   &kp LPAR    &kp RPAR    &kp DEL    
      &trans   &kp MINUS   &kp KP_PLUS   &kp LBRC   &kp RBRC   &kp PIPE              &kp LEFT    &kp DOWN   &kp UP   &kp RIGHT   &kp GRAVE   &kp TILDE  
                                                    &trans     &trans      &kp RET   &mo 3       &trans                                                
    >;
  };

  raise_layer {
    // |   |  1  |  2  |  3  |  4   |   5   |      | 6  | 7  | 8  |  9  |  0  | DEL |
    // |   |  -  |  =  |  [  |  ]   |   \\   |      | F1 | F2 | F3 | F4  | F5  | F6  |
    // |   | ESC | GUI | ALT | CAPS |   "   |      | F7 | F8 | F9 | F10 | F11 | F12 |
    //                       |      | [m] 3 | BSPC |    |    |                       

    bindings = <
      &trans   &kp N1      &kp N2      &kp N3     &kp N4     &kp N5                &kp N6   &kp N7   &kp N8   &kp N9    &kp N0    &kp DEL  
      &trans   &kp MINUS   &kp EQUAL   &kp LBKT   &kp RBKT   &kp BSLH              &kp F1   &kp F2   &kp F3   &kp F4    &kp F5    &kp F6   
      &trans   &kp ESC     &kp LGUI    &kp RALT   &kp CLCK   &kp DQT               &kp F7   &kp F8   &kp F9   &kp F10   &kp F11   &kp F12  
                                                  &trans     &mo 3      &kp BSPC   &trans   &trans                                        
    >;
  };

`);
  });

  it("When there are comments in the middle of the layer, insert the ascii keymap", () => {
    let layouts = [
      ...parse_layouts_from_keymap_content(`
                          layer {
          // mapping here
          bindings = <
                &kp A      &kp CLCK
                &kp CLCK   &kp N1     
              >;
                          };
              `),
    ];
    let rendered_layout = print_keymaps_zmk(
      layouts,
      two_by_two_layout.keymap_layout,
      false
    );
    // prettier-ignore
    expect(rendered_layout).toBe(

`  layer {
    // |  A   | CAPS |
    // | CAPS |  1   |

    bindings = <
      &kp A      &kp CLCK  
      &kp CLCK   &kp N1   
    >;
  };

`
    );
  });
});

describe("ZMK ascii render", () => {
  it("Render an ascii layout", () => {
    let layouts = [
      ...parse_layouts_from_keymap_content(`
                            raise_layer {
            // -----------------------------------------------------------------------------------------
            // |   |  1  |  2  |  3  |  4  |  5  |   |  6  |  7  |  8  |  9  |  0  | DEL |
            // |   |  -  |  =  |  [  |  ]  |  \  |   | F1  | F2  | F3  | F4  | F5  | F6  |
            // |   | ESC | GUI | ALT | CAPS|  "  |   | F7  | F8  | F9  | F10 | F11 | F12 |
            // |                     |     | ADJ | BKSP |    |     |
            bindings = <
                  &trans   &kp N1      &kp N2      &kp N3     &kp N4     &kp N5                &kp N6   &kp N7   &kp N8   &kp N9    &kp N0    &kp DEL
                  &trans   &kp MINUS   &kp EQUAL   &kp LBKT   &kp RBKT   &kp BSLH              &kp F1   &kp F2   &kp F3   &kp F4    &kp F5    &kp F6
                  &trans   &kp ESC     &kp LGUI    &kp RALT   &kp CLCK   &kp DQT               &kp F7   &kp F8   &kp F9   &kp F10   &kp F11   &kp F12
                                                              &trans     &mo 3      &kp BSPC   &trans   &trans
                >;
                            };
                `),
    ];
    let rendered_layout = print_ascii_keymap_zmk(
      layouts[0],
      reviung41_layout.keymap_layout
    );
    // prettier-ignore
    expect(rendered_layout).toBe(
`    // |   |  1  |  2  |  3  |  4   |   5   |      | 6  | 7  | 8  |  9  |  0  | DEL |
    // |   |  -  |  =  |  [  |  ]   |   \\   |      | F1 | F2 | F3 | F4  | F5  | F6  |
    // |   | ESC | GUI | ALT | CAPS |   "   |      | F7 | F8 | F9 | F10 | F11 | F12 |
    //                       |      | [m] 3 | BSPC |    |    |                       
`
    );
  });

  it("When length is even, other keys have extra space on the right", () => {
    let layouts = [
      ...parse_layouts_from_keymap_content(`
                          layer {
          bindings = <
                &kp A      &kp CLCK
                &kp CLCK   &kp N1     
              >;
                          };
              `),
    ];
    let rendered_layout = print_ascii_keymap_zmk(
      layouts[0],
      two_by_two_layout.keymap_layout
    );
    // prettier-ignore
    expect(rendered_layout).toBe(
`    // |  A   | CAPS |
    // | CAPS |  1   |
`
    );
  });

  it("Renders specific behaviours better", () => {
    let layouts = [
      ...parse_layouts_from_keymap_content(`
                          layer {
          bindings = <
                &mt LALT ESC      &mo 2
                &kp CLCK          &kp N1     
              >;
                          };
              `),
    ];
    let rendered_layout = print_ascii_keymap_zmk(
      layouts[0],
      two_by_two_layout.keymap_layout
    );
    // prettier-ignore
    expect(rendered_layout).toBe(
`    // | LALT|ESC | [m] 2 |
    // |   CAPS   |   1   |
`
    );
  });
});
