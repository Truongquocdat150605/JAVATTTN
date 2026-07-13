import { RobotoBase64 } from "./RobotoFont";

export const addCustomFont = (doc) => {
  doc.addFileToVFS("Roboto-Regular.ttf", RobotoBase64);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto", "normal");
};
