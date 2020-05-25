import * as vscode from 'vscode';

const decorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: "green",
  border: "2px solid white"
});

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onWillSaveTextDocument(event => {
    const openEditor = vscode.window.visibleTextEditors.filter(
      editor => editor.document.uri === event.document.uri
    )[0];
    decorate(openEditor);
  });

  let ocdPrepare = vscode.commands.registerCommand('extension.ocdPrepare', (item) => {
    const _workspace = vscode.workspace.workspaceFolders![0];
    const fsPath = _workspace.uri.fsPath;
    const wsedit = new vscode.WorkspaceEdit();
    const filePath = vscode.Uri.file(fsPath + '/ocdfile.json');
    const value = {
      "functionColor": "#ef9700",
      "variableColor": "#7129c4"
    };
    const textEdit = new vscode.TextEdit(new vscode.Range(1, 1, 1, 1), JSON.stringify(value));
    wsedit.createFile(filePath, { ignoreIfExists: true, overwrite: true });
    wsedit.set(filePath, [textEdit]);
    vscode.workspace.applyEdit(wsedit);
    vscode.window.showInformationMessage('Arquivo "ocdfile.json" criado!');
  });

  context.subscriptions.push(ocdPrepare);
}

function decorate(editor: vscode.TextEditor) {
  let sourceCode = editor.document.getText();
  let regex = /(console\.log)/;

  let decorationsArray: vscode.DecorationOptions[] = [];

  const sourceCodeArr = sourceCode.split("\n");

  for (let line = 0; line < sourceCodeArr.length; line++) {
    let match = sourceCodeArr[line].match(regex);

    if (match !== null && match.index !== undefined) {
      let range = new vscode.Range(
        new vscode.Position(line, match.index),
        new vscode.Position(line, match.index + match[1].length)
      );

      let decoration = { range };

      decorationsArray.push(decoration);
    }
  }

  editor.setDecorations(decorationType, decorationsArray);
}

// this method is called when your extension is deactivated
export function deactivate() { }

/*
?? Ducomentação para ajuda
https://vscode.rocks/decorations/
https://vscode.rocks/tags/extensions-api
https://vscode.rocks/tags/extensions

 */

