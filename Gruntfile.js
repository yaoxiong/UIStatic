module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // 检验代码
        // jshint: {
            // all: [
            //     'src/js/*.js'
            // ],
            // options: {
            //     browser: true,            // browser environment
            //     devel: true                //
            // }
        // },
        // grunt-contrib-compass
        compass: {                    // Target
            options: {              // Target options
                environment: 'production',
                noLineComments: true,
                sassDir: 'src/sass',
                imagesDir: 'src/images',
                javascriptsDir: 'src/js'
            },
            server: {
                options: {
                    cssDir: 'src/css'
                }
            }
        },
        // 监听文件
        watch: {
            // jshint: {
            //     files: ['<%= jshint.all %>'],
            //     tasks: ['jshint']
            // },
            js: {
                files: ['src/js/*.js'],
                tasks: ['transport', 'uglify']
            },
            compass: {
                files: ['<%= compass.options.sassDir %>/*.scss', '<%= compass.options.sassDir %>/*/*.scss'],
                tasks: ['compass', 'transport']
            },
            // qunit: {
            //     files: ['src/test/*.js', 'src/*.html'],
            //     tasks: ['qunit']
            // },
            transport: {
                files: ['src/*', 'src/*/*.*', 'src/*/*/*.*', 'src/*/*/*/*.*'],
                tasks: ['transport']
            }
        },
        // 使用UglifyJS压缩js文件
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            seajs: {
                src: 'src/modules/seajs/sea-debug.js',
                dest: 'src/modules/seajs/sea.js'
            }
        },
        transport: {
            options: {

            },
            elseFile: {
                files: [
                    {
                        src: 'src/css',
                        dest: 'dest/css'
                    },
                    {
                        src: 'src/fonts',
                        dest: 'dest/fonts'
                    },
                    {
                        src: 'src/images',
                        dest: 'dest/images'
                    },
                    {
                        src: 'src/js',
                        dest: 'dest/js'
                    },
                    {
                        src: 'src/modules',
                        dest: 'dest/modules'
                    }
                ]
            }
        },
        // 删除文件
        // clean: {
        //     folder: ["dest/sass", "dest/test", "dest/document", "dest/document.html"]
        // },
        // 合并文件
        // concat: {
            // js : {
            //     options: {
            //         // 定义一个用于插入合并输出文件之间的字符
            //         separator: ';'
            //     },
            //     dist: {
            //         // 将要被合并的文件
            //         src: ['src/js/*.js'],
            //         // 合并后的JS文件的存放位置
            //         dest: 'dest/js/<%= pkg.name %>.js'
            //     }
            // },
            // css : {
            //     options: {
            //         // 定义一个用于插入合并输出文件之间的字符
            //         // separator: ';'
            //     },
            //     dist: {
            //         // 将要被合并的文件
            //         src: ['src/stylesheets/*.css'],
            //         // 合并后的JS文件的存放位置
            //         dest: 'dest/stylesheets/<%= pkg.name %>.css'
            //     }
            // }
        // },
        qunit: {
            all: ["src/test/*.html"]
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src : ['dest/*/*.*', 'dest/*.*', '*.*']
                },
                options: {
                    watchTask: true,
                    server: {
                        // baseDir: "./dest/html/",
                        baseDir: "./dest/",
                        index: "index.html"
                    }
                }
            }
        },
        // 自动补全css
        // postcss: {
        //     options: {
        //         failOnError: true,
        //         processors: [
        //             require('autoprefixer')(),
        //             require('cssnext')(),
        //             require('precss')()
        //         ]
        //     },
        //     oEcStore: {
        //         src: 'src/stylesheets/oEcStore.css',
        //         dest: 'dist/stylesheets/oEcStore.css'
        //     },
        //     area: {
        //         src: 'src/stylesheets/oecstore/area.css',
        //         dest: 'dist/stylesheets/oecstore/area.css'
        //     },
        //     buttons: {
        //         src: 'src/stylesheets/oecstore/buttons.css',
        //         dest: 'dist/stylesheets/oecstore/buttons.css'
        //     },
        //     component: {
        //         src: 'src/stylesheets/oecstore/component.css',
        //         dest: 'dist/stylesheets/oecstore/component.css'
        //     },
        //     date: {
        //         src: 'src/stylesheets/oecstore/date.css',
        //         dest: 'dist/stylesheets/oecstore/date.css'
        //     },
        //     dialog: {
        //         src: 'src/stylesheets/oecstore/dialog.css',
        //         dest: 'dist/stylesheets/oecstore/dialog.css'
        //     },
        //     emptyStyle: {
        //         src: 'src/stylesheets/oecstore/empty-style.css',
        //         dest: 'dist/stylesheets/oecstore/empty-style.css'
        //     },
        //     form: {
        //         src: 'src/stylesheets/oecstore/form.css',
        //         dest: 'dist/stylesheets/oecstore/form.css'
        //     },
        //     groundGlass: {
        //         src: 'src/stylesheets/oecstore/groundGlass.css',
        //         dest: 'dist/stylesheets/oecstore/groundGlass.css'
        //     },
        //     layout: {
        //         src: 'src/stylesheets/oecstore/layout.css',
        //         dest: 'dist/stylesheets/oecstore/layout.css'
        //     },
        //     muster: {
        //         src: 'src/stylesheets/oecstore/muster.css',
        //         dest: 'dist/stylesheets/oecstore/muster.css'
        //     },
        //     select: {
        //         src: 'src/stylesheets/oecstore/select.css',
        //         dest: 'dist/stylesheets/oecstore/select.css'
        //     },
        //     slider: {
        //         src: 'src/stylesheets/oecstore/slider.css',
        //         dest: 'dist/stylesheets/oecstore/slider.css'
        //     }
        // }

    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-cmd-transport');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-browser-sync');
    // grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-postcss');

    // 默认被执行的任务列表。
    // grunt.registerTask('default', ['jshint', 'compass', 'postcss', 'transport', 'clean' ,'concat','uglify', 'qunit', 'browserSync', 'watch']);
    grunt.registerTask('default', ['compass', 'transport' , 'uglify', 'qunit', 'browserSync', 'watch']);

};