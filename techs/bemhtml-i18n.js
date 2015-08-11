var vow = require('vow'),
    SourceMap = require('enb-xjst/lib/source-map'),
    keysets = require('enb-bem-i18n/lib/keysets'),
    compileI18N = require('enb-bem-i18n/lib/compile'),
    EOL = require('os').EOL;

/**
 * @class BemhtmlI18nTech
 * @augments {BemhtmlTech}
 * @classdesc
 *
 * Compiles localized BEMHTML template files with XJST translator and merges them into a single BEMHTML bundle.<br/>
 * <br/>
 * Localization is based on pre-built `?.keysets.{lang}.js` bundle files.<br/><br/>
 *
 * @param {Object}    options                                      Options.
 * @param {String}    [options.target='?.bemhtml.{lang}.js']       Path to a target with compiled file.
 * @param {String}    [options.filesTarget='?.files']              Path to a target with BEMHTML FileList.
 * @param {String[]}  [options.sourceSuffixes]                     Files with specified BEMHTML suffixes
 *                                                                 involved in the assembly.
 * @param {String}    options.lang                                 Language identifier.
 * @param {String}    [options.keysetsFile='?.keysets.{lang}.js']  Path to a source keysets file.
 * @param {String}    [options.filesTarget='?.files']              Path to target with FileList.
 * @param {String}    [options.exportName='BEMHTML']               Name of BEMHTML template variable.
 * @param {String}    [options.applyFuncName='apply']              Alias  for `apply` function of base BEMHTML template.
 * @param {Boolean}   [options.devMode=true]                       Sets `devMode` option for convenient debugging.
 *                                                                 If `devMode` is set to true, code of templates
 *                                                                 will not be compiled but only wrapped for development
 *                                                                 purposes.
 * @param {Boolean}   [options.cache=false]                        Sets `cache` option for cache usage.
 * @param {Object}    [options.requires]                           Names of dependencies which should be available from
 *                                                                 code of templates.
 *
 * @example
 * var BemhtmlI18nTech = require('enb-bem-i18n/techs/xjst/bemhtml-i18n'),
 *     KeysetsTech = require('enb-bem-i18n/techs/keysets'),
 *     FileProvideTech = require('enb/techs/file-provider'),
 *     bem = require('enb-bem-techs');
 *
 * module.exports = function(config) {
 *     config.node('bundle', function(node) {
 *         // get FileList
 *         node.addTechs([
 *             [FileProvideTech, { target: '?.bemdecl.js' }],
 *             [bem.levels, levels: ['blocks']],
 *             bem.deps,
 *             bem.files
 *         ]);
 *
 *         // collect and merge keysets files into a bundle
 *         node.addTech([KeysetsTech, {lang: '{lang}' }]);
 *
 *         // build localized BEMHTML file for each lang
 *         node.addTech([BemhtmlI18nTech, { lang: '{lang}' }]);
 *         node.addTarget('?.bemhtml.{lang}.js');
 *     });
 * };
 */
module.exports = require('enb-xjst/techs/bemhtml').buildFlow()
    .name('bemhtml-i18n')
    .target('target', '?.bemhtml.{lang}.js')
    .defineRequiredOption('lang')
    .useFileList(['bemhtml', 'bemhtml.xjst'])
    .useSourceFilename('keysetsFile', '?.keysets.{lang}.js')
    .builder(function (fileList, keysetsFilename) {
        return vow.all([
                this._compileBEMHTML(fileList),
                this._compileI18N(keysetsFilename)
            ], this)
            .spread(function (bemhtmlCode, i18nCode) {
                return [
                    [
                        'if(typeof BEM == "undefined") { var BEM = {}; }',
                        '(function(bem_) {',
                        '    bem_.I18N = ' + i18nCode + ';',
                        '}(BEM));'
                    ].join(EOL),
                    bemhtmlCode
                ].join(EOL);
            });
    })
    .methods({
        /**
         * Compiles BEMHTML module.
         *
         * @param {FileList} fileList — objects that contain file information.
         * @returns {Promise}
         * @private
         */
        _compileBEMHTML: function (fileList) {
            return this._readSourceFiles(fileList)
                .then(function (sources) {
                    var sourceMap = SourceMap(sources),
                        bemhtmlCode = sourceMap.getCode();

                    return this._xjstProcess(bemhtmlCode, sourceMap);
                }, this);
        },
        /**
         * Compiles i18n module.
         *
         * Wraps compiled code for usage with different modular systems.
         *
         * @param {String} keysetsFilename — path to file with keysets..
         * @returns {Promise}
         * @private
         */
        _compileI18N: function (keysetsFilename) {
            return this._readKeysetsFile(keysetsFilename)
                .then(function (keysetsSource) {
                    var parsed = keysets.parse(keysetsSource),
                        opts = {
                            version: parsed.version,
                            language: this._lang
                        };

                    if (opts.version === 'bem-core') {
                        throw new Error('XJST templates can not be used with bem-core i18n system.');
                    }

                    return compileI18N(parsed.core, parsed.keysets, opts);
                });
        },
        /**
         * Reads file with keysets.
         *
         * @param {String} filename — path to file with keysets.
         * @returns {Promise}
         * @private
         */
        _readKeysetsFile: function (filename) {
            var node = this.node,
                root = node.getRootDir(),
                cache = node.getNodeCache(this._target);

            return keysets.read(filename, cache, root);
        }
    })
    .createTech();
