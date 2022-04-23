import { LayoutLayer } from "./layouts";
import { AllDoneException } from "./parser";

export function* parse_layouts_from_keymap_content(keymap_content: string) {
  const content_reader = (function* () {
    let split_content = keymap_content.split("\n");
    for (let i = 0; i < split_content.length; i++) {
      yield split_content[i];
    }
  })();

  const read_line = () => {
    let nextValue = content_reader.next();
    if (nextValue.done) throw new AllDoneException();
    return nextValue.value as string;
  };
  let keep_reading = true;
  while (keep_reading) {
    try {
      let layoutLayer = new LayoutLayer();

      let line = read_line();
      let layout_match = null;
      while (
        line.trim().startsWith("keymap {") ||
        !(layout_match = line.match(/\s*([\w\d]+)\s*\{/))
      ) {
        line = read_line();
      }
      layoutLayer.name = layout_match[1];
      line = read_line();
      let lines = [];
      while (line.trim() != "};") {
        lines.push(line);
        line = read_line();
      }
      layoutLayer.keys = lines
        .map((l) => l.trim())
        .filter(
          (l) =>
            l != ")" &&
            !l.startsWith("bindings = ") &&
            !l.startsWith(">;") &&
            !l.startsWith("//")
        )
        .join("")
        .split(/[&]/)
        .filter((k) => k.trim() != "")
        .map((s) => "&" + s.trim());
      yield layoutLayer;
    } catch (error) {
      let e = error as AllDoneException;
      if (!e.IsAllDone) throw error; //TODO: rethrow correctly?
      keep_reading = false;
    }
  }
}
