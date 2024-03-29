import Head from "next/head";
import Link from "next/link";
import Layout from "components/layout";
import styles from "./index.module.css";
import React, { Component } from "react";

import { useRouter } from "next/router";
import {
  existing_layouts,
  KeyboardConfiguration,
  LayoutLayer,
} from "code/layouts";
import {
  parse_layouts_from_keymap_content,
  print_ascii_keymap_qmk,
  print_keymaps_qmk,
} from "code/qmk";

const sample_sofle_keymap = `
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
  [_BASE] = LAYOUT(
    // Any line with comments here will insert an ascii keyboard
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
  [_SYMBOL] = LAYOUT(
      A(KC_F4) , KC_F13        , KC_F14        , KC_F15        , KC_F16        , KC_NO         ,                    KC_NO         , KC_MPRV       , KC_MPLY , KC_MNXT , KC_MINS , KC_EQL  ,
      KC_TAB   , KC_F17        , KC_F18        , A(ALGR(KC_E)) , KC_ASTR       , KC_ASTR       ,                    KC_LPRN       , KC_LPRN       , KC_NO   , KC_BML_GRAVE , KC_LBRC , KC_RBRC ,
      KC_NO    , A(ALGR(KC_2)) , KC_AT         , KC_COLN       , A(ALGR(KC_7)) , A(ALGR(KC_8)) ,                    A(ALGR(KC_9)) , A(ALGR(KC_0)) , KC_ASTR , KC_LPRN , KC_QUOT , KC_BSLS ,
      KC_LSFT  , KC_NUBS       , KC_BML_ATILDE , KC_SCLN       , KC_BML_OTILDE , KC_NUBS       , KC_NO ,    KC_NO , S(KC_NUBS)    , KC_RPRN       , KC_COMM , KC_DOT  , KC_SLSH , KC_RSFT ,
                                _______       , _______       , _______       , TT(_NUMPAD)   , KC_NO ,    KC_NO , KC_NO         , _______       , _______ , _______
  ),
  [_NUMPAD] = LAYOUT(
      KC_BSPC , KC_UP   , KC_P7   , KC_P8   , KC_P9   , KC_PSLS     ,                        TG(_NUMPAD) , ROTARY_MODE_LEFT , ROTARY_MODE_RIGHT , KC_NO   , KC_NO  , KC_NLCK ,
      KC_LEFT , KC_RGHT , KC_P4   , KC_P5   , KC_P6   , KC_PAST     ,                        KC_NO       , KC_NO         , KC_NO                    , KC_NO   , KC_NO  , KC_NO   ,
      KC_DEL  , KC_DOWN , KC_P1   , KC_P2   , KC_P3   , KC_PMNS     ,                        KC_NO       , KC_NO         , KC_NO                    , KC_NO   , KC_DEL , KC_BSPC ,
      KC_NO   , KC_COMM , KC_P0   , KC_PDOT , KC_PENT , KC_PPLS     , KC_NO   ,    KC_NO   , KC_NO       , KC_NO         , KC_NO                    , KC_NO   , KC_NO  , KC_NO   ,
                          _______ , _______ , _______ , TT(_NUMPAD) , _______ ,    _______ , _______     , _______       , _______                  , _______
  ),
  };
  `;

interface LayoutFormatState {
  input_keymap_content: string;
  formatted_keymap_content: string;
  formatted_ascii_keymap_content: string;
  selected_keyboard: KeyboardConfiguration;
}
interface LayoutFormatProps {
  keyboard?: string;
  pushKeyboard: (keyboardName: string) => void;
}
class LayoutFormatComponent extends Component<
  LayoutFormatProps,
  LayoutFormatState
> {
  private _pushKeyboard: (keyboardName: string) => void;
  constructor(props: LayoutFormatProps) {
    super(props);
    let selected_keyboard = existing_layouts[0];
    if (props.keyboard)
      selected_keyboard =
        existing_layouts.find((k) => k.name == props.keyboard) ??
        existing_layouts[0];

    this._pushKeyboard = props.pushKeyboard;

    this.state = {
      input_keymap_content: "",
      formatted_keymap_content: "",
      formatted_ascii_keymap_content: "",
      selected_keyboard: selected_keyboard,
    };

    this.onKeymapInputChange = this.onKeymapInputChange.bind(this);
    this.onKeyboardSelection = this.onKeyboardSelection.bind(this);
    this.loadSampleKeymap = this.loadSampleKeymap.bind(this);
  }

  onKeymapInputChange(changeEvent: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = changeEvent.target.value;

    this.setState({
      input_keymap_content: newValue,
    });
    this.parseInputKeymap(newValue, this.state.selected_keyboard);
  }
  onKeyboardSelection(changeEvent: React.ChangeEvent<HTMLSelectElement>) {
    let selected_keyboard = existing_layouts.find(
      (l) => l.name == changeEvent.target.value
    );
    this._pushKeyboard(selected_keyboard.name);
    this.setState({
      selected_keyboard: selected_keyboard,
    });
    this.parseInputKeymap(this.state.input_keymap_content, selected_keyboard);
  }
  parseInputKeymap(newValue: string, selected_keyboard: KeyboardConfiguration) {
    let layouts: LayoutLayer[] = [];

    let render_header_and_footer = false;

    if (newValue.toLowerCase().indexOf("progmem") != -1)
      render_header_and_footer = true;

    for (let layout of parse_layouts_from_keymap_content(
      newValue,
      selected_keyboard.keymap_layout_markers
    )) {
      layouts.push(layout);
    }

    let newLayouts = print_keymaps_qmk(
      layouts,
      selected_keyboard.keymap_layout,
      render_header_and_footer
    );
    let newAsciiLayouts = layouts
      .map((layer) =>
        print_ascii_keymap_qmk(layer, selected_keyboard.keymap_layout)
      )
      .join("\n");
    this.setState({
      formatted_keymap_content: newLayouts,
      formatted_ascii_keymap_content: newAsciiLayouts,
    });
  }

  loadSampleKeymap() {
    this.setState({
      input_keymap_content: sample_sofle_keymap,
    });
    this.parseInputKeymap(sample_sofle_keymap, this.state.selected_keyboard);
  }

  render() {
    return (
      <Layout home={false}>
        <Head>
          <title>QMK Layout formatter</title>
        </Head>
        <h1>Formats keymap.c layouts</h1>
        <div>
          <label htmlFor="keyboard">Select a keyboard:</label>

          <select
            name="keyboard"
            id="keyboard"
            defaultValue={this.state.selected_keyboard.name}
            onChange={this.onKeyboardSelection}
          >
            {existing_layouts.map((configuration) => (
              <option value={configuration.name} key={configuration.name}>
                {configuration.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="keymap_input">
            Paste your keymap.c contents here:
          </label>

          <div>
            <textarea
              name="keymap_input"
              id="keymap_input"
              cols={30}
              rows={10}
              className={styles.input_textarea}
              value={this.state.input_keymap_content}
              onChange={this.onKeymapInputChange}
            ></textarea>
          </div>
          <button onClick={this.loadSampleKeymap}>
            Load sample sofle keymap
          </button>
        </div>
        <h3>Here are the formatted layouts:</h3>
        <div>
          <textarea
            name="formatted_keymap_output"
            id="formatted_keymap_output"
            readOnly={true}
            defaultValue={this.state.formatted_keymap_content}
            className={styles.output_textarea}
          ></textarea>
        </div>
        <h4>A rendered ascii keymap:</h4>
        <div>
          <textarea
            name="formatted_ascii_keymap_output"
            id="formatted_ascii_keymap_output"
            readOnly={true}
            defaultValue={this.state.formatted_ascii_keymap_content}
            className={styles.output_textarea}
          ></textarea>
        </div>
        <h2>
          <Link href="/">Back home</Link>
        </h2>
      </Layout>
    );
  }
}

const WrappedLayoutFormatComponent = (params) => {
  const router = useRouter();
  const { keyboard } = router.query;
  let pushKeyboard = (name: string) => {
    router.push(name, name, { scroll: false, shallow: true });
  };
  return (
    <LayoutFormatComponent
      keyboard={(keyboard ?? "").toString()}
      pushKeyboard={pushKeyboard}
    ></LayoutFormatComponent>
  );
};

export default WrappedLayoutFormatComponent;

export async function getServerSideProps(ctx) {
  const { keyboard } = ctx.query;
  return {
    props: {
      keyboard,
    },
  };
}
