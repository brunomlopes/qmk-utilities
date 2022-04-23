import { existing_layouts } from "code/layouts";
import { parse_layouts_from_keymap_content, print_keymaps_zmk } from "code/zmk";

let reviung41_layout = existing_layouts.find((l) => l.name == "Reviung41");

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
    bindings = <
      &trans   &kp N1      &kp N2      &kp N3     &kp N4     &kp N5                &kp N6   &kp N7   &kp N8   &kp N9    &kp N0    &kp DEL  
      &trans   &kp MINUS   &kp EQUAL   &kp LBKT   &kp RBKT   &kp BSLH              &kp F1   &kp F2   &kp F3   &kp F4    &kp F5    &kp F6   
      &trans   &kp ESC     &kp LGUI    &kp RALT   &kp CLCK   &kp DQT               &kp F7   &kp F8   &kp F9   &kp F10   &kp F11   &kp F12  
                                                  &trans     &mo 3      &kp BSPC   &trans   &trans                                        
    >;
  };

`);
  });
});
