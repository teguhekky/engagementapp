'use strict';
module.exports = function(grunt) {


    // Load Grunt Tasks
    require('load-grunt-tasks')(grunt);
    let webpack = require('webpack');
    //let HtmlWebpackPlugin = require('html-webpack-plugin');
    let SplitByNamePlugin = require('split-by-name-webpack-plugin');
    //require('webpack-dev-server');
    
    const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
    
    grunt.loadNpmTasks('grunt-cache-breaker');

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // // Metadata.
        // meta: {
        //     // basePath: '../',
        //     srcPath: 'dev/',
        //     deployPath: 'deploy/',
        // },
 
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ',        

// ---------------------------
// Typescript Configuration
// ---------------------------        

        ts: {
            default: {
                src: ['app/**/*.ts'],
                //out: '../debug/js/main.js',
                outDir: 'js/',
                tsconfig: true
            }
        },

// ---------------------------
// Webpack Configuration
// ---------------------------  

        webpack: {
            default: {
                entry: {
                    'vendor' : './app/vendor.ts',
                    'angular' : './app/angular.ts',
                    'app' : './app/main.ts'
                    // angular: './app/angular.ts'
                    
                },
                devtool: 'source-map',
                output: {
                    path: __dirname + '/scripts',
                    filename: '[name].js',
                    chunkFilename: "[id].chunk.js"
                },
                resolve: {
                    extensions: ['.js', '.ts','']
                },
                module: {
                    loaders: [
                        { test: /\.ts$/, loader: 'ts-loader' },
                        //{ test: /\.js$/, loader: 'raw' }
                    ],
                },
                plugins: [
                    new webpack.optimize.CommonsChunkPlugin({
                        name: ['app','angular','vendor']
                    }),
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        }
                    })

                ],
                
                devServer: {
                    historyApiFallback: true,
                    stats: 'minimal'
                }
                
            },
        },
        
        webpack_release: {
            default: {
                entry: {
                    'vendor' : './app/vendor.ts',
                    'angular' : './app/angular.ts',
                    'app' : './app/main.ts'
                    // angular: './app/angular.ts'
                    
                },
                devtool: 'source-map',
                output: {
                    path: __dirname + '/scripts',
                    filename: '[name].js',
                    chunkFilename: "[id].chunk.js"
                },
                resolve: {
                    extensions: ['.js', '.ts','']
                },
                module: {
                    loaders: [
                        { test: /\.ts$/, loader: 'ts-loader' },
                        //{ test: /\.js$/, loader: 'raw' }
                    ],
                },
                plugins: [
                    new webpack.NoErrorsPlugin(),
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.CommonsChunkPlugin({
                        name: ['app','angular','vendor']
                    }),
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        }
                    }),
                    new webpack.DefinePlugin({
                        'process.env': {
                            'ENV': JSON.stringify(ENV)
                        }
                    })

                ],
                
                devServer: {
                    historyApiFallback: true,
                    stats: 'minimal'
                }
                
            },
        },


// ---------------------------
// Concatenation Configuration
// ---------------------------        

        concat: {
            js: {
                src: ['app/**/*.js'],
                dest: '../../debug/js/app.js',
            },
        },

// ---------------------
// JSHint Configuration
// ---------------------        

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
            },            
            files: ['.../../debug/js/**.js'
                    // 'dev/js/*.js'
                    ],
        },

// ---------------------
// SASS Configuration
// --------------------- 

        sass: {
            debug: {
                files: {
                    '../../debug/css/app.css': 'scss/app.scss',
                },
            },
        },

// --------------------------
// Minification Configuration
// --------------------------         

        uglify: {
            js: {
                src: ['../../debug/js/app.js'],
                dest: '../../debug/js/app.min.js',
            },
            options: {
                mangle: false
            },
        },

        cssmin: {
            css: {
                src: ['../../debug/css/app.css', '../../debug/css/nouislider.css'],
                dest: '../../debug/css/app.min.css',
            },
        },       

// --------------------
// Usemin Configuration
// --------------------

        useminPrepare:{
            html:'index.html',
            options:{
                dest:'../deploy'
            },
        },

        usemin:{
            html: ['../deploy/index.html'],
        },

// --------------------
// Copy Configuration
// --------------------   

        copy:{

            dependencies: {
                files: [
                    {
                        src:[
                            'node_modules/es6-shim/es6-shim.min.js',
                            'node_modules/systemjs/dist/system-polyfills.js',
                            'node_modules/systemjs/dist/system.src.js',
                            'node_modules/fastclick/lib/fastclick.js', 
                            'node_modules/hammerjs/hammer.min.js',
                            'node_modules/nouislider/distribute/nouislider.js',
                            'node_modules/core-js/client/shim.min.js',
                            'node_modules/zone.js/dist/zone.js',
                            'node_modules/reflect-metadata/Reflect.js',
							'sw/smart-service-worker.js'
                        ],
                        dest:'../../debug/scripts',
                        expand: true, 
                        flatten: true,
                    }
                ]
            },

            resources: {
                files: [              
                    {
                        src:['img/**/*.*'],
                        dest:'../../debug/',
                        expand: true,
                    }
                ]
            },
            
            js: {
                files: [
                    {
                        src:['services/**/*.json'],
                        dest:'../../debug/',
                        expand: true,
                    },
                    {
                        src:['init.js','tsconfig.json'],
                        dest:'../../debug/',
                        expand: true,
                    },
                    {
                        src:['scripts/*.js','scripts/*.js.map'],
                        dest:'../../debug/',
                        expand: true,
                    }
                ]
            },

            css: {
                files: [              
                    {
                        src:['node_modules/nouislider/src/nouislider.css'],
                        dest:'../../debug/css/nouislider.css',
                        expand: false,
                        flatten: true,
                    }
                ] 
            } ,

            html: {
                files: [              
                    {
                        src:['app/**/*.html', 'index.html', 'index.cordova.html'],
                        dest:'../../debug/',
                        expand: true,
                    }
                ] 
            } ,
                
            cordova: {
                files: [              
                    {
                        cwd: '../../debug/',
                        //src:['**'],
						src:[
							'app/**/*.html',
							'css/*.*',
							'img/**/*.*',
							'scripts/*.*',
							'services/**/*.json',
                            '**/*.js',
                            '.baseDir.js',
                            'init.js',
                            'tsconfig.json'
						],
                        dest:'../cordova/www/',
                        expand: true
                    },
					{
                        cwd: '../../debug/',
                        src:['index.cordova.html'],
                        dest:'../cordova/www/index.html',
                        expand: false,
                        flatten: true,
                    }
                ] 
            },
            
            dependencies_prod:{
                files: [
                    {
                        src:[
                            'node_modules/es6-shim/es6-shim.min.js',
                            'node_modules/systemjs/dist/system-polyfills.js',
                            'node_modules/systemjs/dist/system.src.js',
                            'node_modules/fastclick/lib/fastclick.js', 
                            'node_modules/hammerjs/hammer.min.js',
                            'node_modules/nouislider/distribute/nouislider.js',
                            'node_modules/core-js/client/shim.min.js',
                            'node_modules/zone.js/dist/zone.js',
                            'node_modules/reflect-metadata/Reflect.js',
							'sw/smart-service-worker.js'
                        ],
                        dest:'../../production/scripts',
                        expand: true, 
                        flatten: true,
                    }
                ]
            },
            
            resources_prod: {
                files: [              
                    {
                        src:['img/**/*.*'],
                        dest:'../../production/',
                        expand: true,
                    }
                ]
            },
            
            js_prod: {
                files: [
                    {
                        src:['services/**/*.json'],
                        dest:'../../production/',
                        expand: true,
                    },
                    {
                        src:['init.js','tsconfig.json'],
                        dest:'../../production/',
                        expand: true,
                    },
                    {
                        src:['scripts/*.js'],
                        dest:'../../production/',
                        expand: true,
                    }
                ]
            },

            css_prod: {
                files: [              
                    {
                        src:['node_modules/nouislider/src/nouislider.css'],
                        dest:'../../production/css/nouislider.css',
                        expand: false,
                        flatten: true,
                    }
                ] 
            } ,
            
            html_prod:{
                    files: [
                    {
                        src:['app/**/*.html', 'index.html', 'index.cordova.html'],
                        dest:'../../production/',
                        expand: true,
                    },
                    ]
            },
            
            cordova_prod: {
                files: [              
                    {
                        cwd: '../../production/',
						src:[
							'app/**/*.html',
							'css/*.*',
							'img/**/*.*',
							'scripts/*.*',
							'services/**/*.json',
                            '**/*.js',
                            '.baseDir.js',
                            'init.js',
                            'tsconfig.json'
						],
                        dest:'../cordova/www/',
                        expand: true
                    },
					{
                        cwd: '../../production/',
                        src:['index.cordova.html'],
                        dest:'../cordova/www/index.html',
                        expand: false,
                        flatten: true,
                    }
                ] 
            }
             
        },        


// ---------------------
// Clean Configuration
// ---------------------  
        clean:{
            options: { force: true },
            debug: ["../../debug/", "!../../debug/node_modules/"],
            prod: ["../../production/", "!../../production/node_modules/"],
            cordova: ["../cordova/www/**"],
            sasscache: [".sass-cache/"]  
        },

// ---------------------
// Watch Configuration
// ---------------------         

        watch: {
            js: {
                files: ['script/*.js', 'Gruntfile.js', 'tsconfig.json','init.js'],
                tasks: ['copy:js', 'jshint'],
            },
            ts: {
                files: ['app/**/*.ts'],
                tasks: ['webpack','copy:js'],
            },
            sass: {
                files: 'scss/*.scss',
                tasks: ['sass'],
            },
            cssmin: {
                files: '../../debug/css/app.css',
                tasks: ['cssmin'],
            },
            html: {
                files: ['*.html','app/**/*.html'],
                tasks: ['copy:html'],
            },
            img: {
                files: 'img/*.*',
                tasks: ['copy:resources'],
            },
        },

// ---------------------
// Cache Breaker Configuration
// ---------------------          
        cachebreaker: {
            dev: {
                options: {
                    match: ['init.js', 'app.min.css','app.js'],
                },
                files: {
                    src: ['../../debug/index.html']
                }
            }
        }
        
        
    });    
      

// ---------------------
// Register Grunt Tasks
// ---------------------     

    grunt.registerTask('build',[
        // 'useminPrepare',
        'concat',
        'sass',
        'cssmin',
        'uglify',
        // 'usemin',
        'watch'
        ]);   

    grunt.registerTask('debug',[      
        'clean:debug',
        'copy:dependencies',
        'copy:resources',
        'copy:css',
        'webpack',
        'copy:js',
        'copy:html',
        'sass',
        'clean:sasscache',
        'jshint',
        'cssmin',
        'cachebreaker',
        'watch'
        ]);
        
    grunt.registerTask('production',[      
        'clean:prod',
        'clean:cordova',
        'copy:dependencies_prod',
        'copy:resources_prod',
        'copy:css_prod',
        'webpack_prod',
        'copy:js_prod',
        'copy:html_prod',
        'sass',
        'clean:sasscache',
        'jshint',
        'cssmin',
        'cachebreaker',
        'copy:cordova_prod'
        ]);     

    grunt.registerTask('cordova',[      
        'clean:cordova',
        'copy:cordova'
        ]); 


    grunt.registerTask('default',[
        'jshint'
        ]);               

    grunt.registerTask('wp',[      
        'webpack'
    ]);

    grunt.registerTask('tss',[      
        'clean:debug',
        'ts'
    ]);

};