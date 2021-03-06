const vscode = require("vscode");
const axios = require("axios");
const xmlParser = require("fast-xml-parser");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  // you can replace the rss.xml file with yours to get your blogs
  const res = await axios.get("https://anirudhpanda.hashnode.dev/rss.xml");
  const articles = xmlParser.parse(res.data).rss.channel.item.map((article) => {
    return {
      label: article.title,
      link: article.link,
    };
  });
  
  let disposable = vscode.commands.registerCommand(
    "hashnode-blogs-search.searchHashnodeBlog",
    async function () {
      const article = await vscode.window.showQuickPick(articles, {
        matchOnDetail: true,
      });

      if (article == null) return;

      vscode.env.openExternal(article.link);
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate

function deactivate() {}

module.exports = {
  activate,
  deactivate,
}



