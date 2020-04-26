/**
 * @file 意图处理类
 * @author yelvye@baidu.com
 */

const path = require('path');
const BaseBot = require('bot-sdk');
const Document = BaseBot.Directive.DPL.Document;
const RenderDocument = BaseBot.Directive.DPL.RenderDocument;
const SetStateCommand = BaseBot.Directive.DPL.Commands.SetStateCommand;
const ExecuteCommands = BaseBot.Directive.DPL.ExecuteCommands;
const UpdateComponentCommand = BaseBot.Directive.DPL.Commands.UpdateComponentCommand;
const ScrollCommand = BaseBot.Directive.DPL.Commands.ScrollCommand;
const SetPageCommand = BaseBot.Directive.DPL.Commands.SetPageCommand;
const ControlMediaCommand = BaseBot.Directive.DPL.Commands.ControlMediaCommand;
const AnimationCommand = BaseBot.Directive.DPL.Commands.AnimationCommand;
const ScrollToIndexCommand = BaseBot.Directive.DPL.Commands.ScrollToIndexCommand;

const VideoList = [
    {
        "src": "https://dbp-dict.bj.bcebos.com/video2.mp4",
        "index": "video_list_1",
        "name": "葡萄酒",
        "desc": "人生就像一杯酒"
    },
    {
        "src": "https://dbp-dict.bj.bcebos.com/video4.mp4",
        "index": "video_list_2",
        "name": "初夏",
        "desc": "最美人间四月天"
    },
    {
        "src": "https://dbp-dict.bj.bcebos.com/video3.mp4",
        "index": "video_list_3",
        "name": "海",
        "desc": "我要和你一起看日出, 面向大海"
    },
    {
        "src": "https://dbp-dict.bj.bcebos.com/video4.mp4",
        "index": "video_list_4",
        "name": "心动的感觉",
        "desc": "你知道我对你不仅仅是喜欢"
    },
    {
        "src": "https://dbp-dict.bj.bcebos.com/video5.mp4",
        "index": "video_list_5",
        "name": "冷月",
        "desc": "曾经有一个美丽的女孩追求过我，但是我没有接受，现在后悔了"
    },
    {
        "src": "https://dbp-dict.bj.bcebos.com/video6.mp4",
        "index": "video_list_6",
        "name": "给大家讲一个笑话吧",
        "desc": "你就是一个笑话"
    },
    {
        "src": "https://dbp-dict.bj.bcebos.com/video7.mp4",
        "index": "video_list_7",
        "name": "加班，加班",
        "desc": "很可以"
    }
];
class Bot extends BaseBot {

    /**
     * 构造函数
     *
     * @param {Object} postData bot请求入参
     */

    constructor(postData) {
        super(postData);
        this.addLaunchHandler(() => {
            this.waitAnswer();
            this.setExpectSpeech(false)
            return this.genDPLDirective('./doc/launch.json').then(directive => {
                if (directive) {
                    return {
                        directives: [directive],
                        outputSpeech: 'DPL演示'
                    };
                }
            });
        });

        //demo1 简单图片
        this.addIntentHandler('dpl_demo1', () => {
            this.waitAnswer();
            this.setExpectSpeech(false)
            return this.genDPLDirective('./doc/demo1.json').then(directive => {
                if (directive) {
                    return {
                        directives: [directive],
                        outputSpeech: '简单图片'
                    }
                }
            });
        });

        this.addEventListener('UserEvent', function (event) {
            this.waitAnswer();
            this.setExpectSpeech(false);
            let componentId = event.payload.componentId;
            let executeCommands = new ExecuteCommands(event.payload.globalArguments[0]);
            let animationCommand = new AnimationCommand()
            executeCommands.setCommands(animationCommand);


            return {
                directives: [executeCommands],
                outputSpeech: '下发有队列ID的指令'
            };
        });

        this.addDefaultEventListener(function (e) {
            console.log(`default event repsonse ->`, e)
            this.waitAnswer();
            this.setExpectSpeech(false);
        });


        //退出意图
        this.addSessionEndedHandler(() => {
            return {
                outputSpeech: '退出，欢迎下次再来'
            };
        });
    }

    /**
     * 生成DPL.RenderDocument指令
     *
     * @param {string} pathUrl 文档路径
     * @return {Promise}
     */
    genDPLDirective(pathUrl) {
        pathUrl = path.join(__dirname, pathUrl)
        let document = new Document()
        let renderDocument = new RenderDocument()
        return document.getDocumentFromPath(pathUrl).then(doc => {
            if (doc) {
                document.initDocument(doc)
                renderDocument.setDocument(document);
            }
            return renderDocument;
        }).catch(err => {
            console.log(`err:${err}`);
        });

    }
}

module.exports = Bot;
