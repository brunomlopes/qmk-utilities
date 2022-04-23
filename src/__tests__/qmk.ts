import { existing_layouts } from "code/layouts";
import { parse_layouts_from_keymap_content } from "code/qmk";

const sofle_layout = existing_layouts.find((l) => l.name == "Sofle");

describe(`QMK Parser`, () => {
  it("Parses a sofle keymap with a single layer", () => {
    let layouts = [
      ...parse_layouts_from_keymap_content(
        `
      [_BASE] = LAYOUT(
        KC_GRV              , KC_1 , KC_2    , KC_3    , KC_4    , KC_5              ,                                           KC_6        , KC_7    , KC_8    , KC_9    , KC_0    , KC_MINS ,
        KC_ESC              , KC_Q , KC_W    , KC_E    , KC_R    , KC_T              ,                                           KC_Y        , KC_U    , KC_I    , KC_O    , KC_P    , KC_RBRC ,
        MT(MOD_LSFT,KC_TAB) , KC_A , KC_S    , KC_D    , KC_F    , KC_G              ,                                           KC_H        , KC_J    , KC_K    , KC_L    , KC_BSLS , KC_BSPC ,
        KC_LSFT             , KC_Z , KC_X    , KC_C    , KC_V    , KC_B              , KC_MS_BTN1         ,    KC_MUTE         , KC_N        , KC_M    , KC_COMM , KC_DOT  , KC_SLSH , KC_RSFT ,
                                    KC_LCTL , KC_LALT , KC_LGUI , LT(_LOWER,KC_SPC) , LT(_SYMBOL,KC_ENT) ,    LT(_NAV,KC_SPC) , MO(_SYMBOL) , KC_RCTL , KC_RGUI , KC_RALT
    ),
        `,
        sofle_layout.keymap_layout_markers
      ),
    ];
    expect(layouts.length).toBe(1);
    let layout = layouts[0];
    expect(layout.name).toBe("_BASE");
    expect(layout.keys.length).toBe(60);
    expect(layout.keys.slice(12, 24)).toEqual([
      "KC_ESC",
      "KC_Q",
      "KC_W",
      "KC_E",
      "KC_R",
      "KC_T",
      "KC_Y",
      "KC_U",
      "KC_I",
      "KC_O",
      "KC_P",
      "KC_RBRC",
    ]);
  });

  it("Parses a sofle keymap with two layers", () => {
    let layouts = [
      ...parse_layouts_from_keymap_content(
        `
      [_LOWER] = LAYOUT(
        KC_DEL  , KC_F1   , KC_F2   , KC_F3   , KC_F4   , KC_F5   ,                        KC_F6       , KC_F7   , KC_F8      , KC_F9   , KC_F10  , KC_F11  ,
        KC_GRV  , KC_1    , KC_2    , KC_3    , KC_4    , KC_5    ,                        KC_6        , KC_7    , KC_8       , KC_9    , KC_0    , KC_F12  ,
        KC_TILD , KC_EXLM , KC_AT   , KC_HASH , KC_DLR  , KC_PERC ,                        KC_CIRC     , KC_AMPR , KC_ASTR    , KC_LPRN , KC_RPRN , KC_PIPE ,
        _______ , KC_UNDS , KC_MINS , KC_NO   , KC_LCBR , KC_LBRC , _______ ,    _______ , KC_NUBS     , KC_RPRN , S(KC_NUBS) , KC_NO   , KC_NO   , _______ ,
                            _______ , _______ , _______ , _______ , _______ ,    _______ , TT(_NUMPAD) , _______ , _______    , _______
    ),
    [_NAV] = LAYOUT(
        KC_NO   , KC_NO   , KC_NO   , KC_NO   , A(KC_F4)        , KC_NO   ,                        KC_NO   , KC_NO      , C(KC_UP)   , KC_NO      , KC_NO     , A(KC_F4)   ,
        _______ , KC_INS  , KC_PSCR , KC_PAUS , A(ALGR(KC_TAB)) , KC_NO   ,                        KC_PGUP , KC_HOME    , KC_UP      , KC_END     , C(KC_DEL) , C(KC_BSPC) ,
        _______ , KC_LALT , KC_LCTL , KC_LSFT , KC_NO           , KC_CAPS ,                        KC_PGDN , KC_LEFT    , KC_DOWN    , KC_RGHT    , KC_DEL    , KC_BSPC    ,
        _______ , C(KC_Z) , C(KC_X) , C(KC_C) , C(KC_V)         , KC_INS  , _______ ,    _______ , KC_NO   , C(KC_LEFT) , C(KC_DOWN) , C(KC_RGHT) , KC_NO     , _______    ,
                            _______ , _______ , _______         , _______ , _______ ,    _______ , KC_ENT  , _______    , _______    , _______
    ),
        `,
        sofle_layout.keymap_layout_markers
      ),
    ];
    expect(layouts.length).toBe(2);
    expect(layouts.map((l) => l.name)).toStrictEqual(["_LOWER", "_NAV"]);
    expect(layouts.map((l) => l.keys.length)).toStrictEqual([60, 60]);
  });
  it("Parser ignore the common prefixes", () => {
    let layouts = [
      ...parse_layouts_from_keymap_content(
        `
        const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
          [_BASE] = LAYOUT(
              KC_GRV              , KC_1 , KC_2    , KC_3    , KC_4    , KC_5              ,                                           KC_6        , KC_7    , KC_8    , KC_9    , KC_0    , KC_MINS ,
              KC_ESC              , KC_Q , KC_W    , KC_E    , KC_R    , KC_T              ,                                           KC_Y        , KC_U    , KC_I    , KC_O    , KC_P    , KC_RBRC ,
              MT(MOD_LSFT,KC_TAB) , KC_A , KC_S    , KC_D    , KC_F    , KC_G              ,                                           KC_H        , KC_J    , KC_K    , KC_L    , KC_BSLS , KC_BSPC ,
              KC_LSFT             , KC_Z , KC_X    , KC_C    , KC_V    , KC_B              , KC_MS_BTN1         ,    KC_MUTE         , KC_N        , KC_M    , KC_COMM , KC_DOT  , KC_SLSH , KC_RSFT ,
                                          KC_LCTL , KC_LALT , KC_LGUI , LT(_LOWER,KC_SPC) , LT(_SYMBOL,KC_ENT) ,    LT(_NAV,KC_SPC) , MO(_SYMBOL) , KC_RCTL , KC_RGUI , KC_RALT
          ),
          [_COLEMAK] = LAYOUT(
              KC_GRV  , KC_1 , KC_2    , KC_3    , KC_4    , KC_5    ,                       KC_6    , KC_7    , KC_8    , KC_9    , KC_0    , KC_GRV  ,
              KC_ESC  , KC_Q , KC_W    , KC_F    , KC_P    , KC_G    ,                       KC_J    , KC_L    , KC_U    , KC_Y    , KC_SCLN , KC_BSPC ,
              KC_TAB  , KC_A , KC_R    , KC_S    , KC_T    , KC_D    ,                       KC_H    , KC_N    , KC_E    , KC_I    , KC_O    , KC_QUOT ,
              KC_LSFT , KC_Z , KC_X    , KC_C    , KC_V    , KC_B    , KC_MUTE ,    KC_NO  , KC_K    , KC_M    , KC_COMM , KC_DOT  , KC_SLSH , KC_RSFT ,
                              KC_LGUI , KC_LALT , KC_LCTL , _______ , KC_ENT  ,    KC_SPC , _______ , KC_RCTL , KC_RALT , KC_RGUI
          ),
        `,
        sofle_layout.keymap_layout_markers
      ),
    ];
    expect(layouts.length).toBe(2);
    expect(layouts.map((l) => l.name)).toStrictEqual(["_BASE", "_COLEMAK"]);
    expect(layouts.map((l) => l.keys.length)).toStrictEqual([60, 60]);
  });
});
