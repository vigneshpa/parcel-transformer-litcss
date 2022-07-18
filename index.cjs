const { Transformer } = require('@parcel/plugin');
const { bundle: bundleCSS, browserslistToTargets } = require('@parcel/css');
const { relativeUrl } = require('@parcel/utils');
const browserslist = require('browserslist');

module.exports.default = new Transformer({
  async transform({ asset, options, logger }) {
    const minify = asset.env.shouldOptimize ?? true;
    const targets = browserslistToTargets(browserslist(asset.env.engines.browsers));
    const filename = relativeUrl(options.projectRoot, asset.filePath);
    logger.verbose({ message: 'file: ' + filename });
    const { code } = bundleCSS({
      minify,
      filename,
      targets,
      sourceMap: false,
    });
    const assets = [asset];
    asset.type = 'js';

    const codeOut = `import {css} from "lit";export default css\`${code.toString().replace(/\`/g, '\\`')}\``;

    asset.setCode(codeOut);
    return assets;
  },
});
