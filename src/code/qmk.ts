import { LayoutLayer } from "./layouts";
import { AllDoneException } from "./parser";

export function* parse_layouts_from_keymap_content(
  keymap_content: string,
  layout_definition_start_marker: string[]
) {
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
      let marker = "";
      while (
        !(layoutLayer.layout_function = layout_definition_start_marker.find(
          (m) => line.includes(m)
        ))
      ) {
        line = read_line();
      }
      layoutLayer.name = line.match(/\[\s*([\w\d]+)\s*\]/)[1];
      line = read_line();
      let lines = [];
      while (line.trim() != ")," && line.trim() != "};") {
        lines.push(line);
        line = read_line();
      }
      layoutLayer.keys = lines
        .filter((l) => l.trim() != ")")
        .map((l) => l.trim().replace(/\\$/, ""))
        .join("")
        .split(/[,](?!\s*\w+\))/)
        .map((s) => s.trim());
      yield layoutLayer;
    } catch (error) {
      let e = error as AllDoneException;
      if (!e.IsAllDone) throw error; //TODO: rethrow correctly?
      keep_reading = false;
    }
  }
}
