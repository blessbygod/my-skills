let BaseBot = require('bot-sdk');
class Bot extends BaseBot {
    /**
     * postData可以不传，由于DuerOS对bot是post请求，sdk默认自动获取
     */
    constructor(postData) {
            super(postData)

            this.addLaunchHandler(() => {
                return {
                    directives: [this.getTemplate1('欢迎来到王者英雄榜, 我们用DPL来实现吧!!!')],
                    outputSpeech: '欢迎来到王者英雄榜'
                };
            });

            this.addIntentHandler('skill_query', () => {
                let hero = this.getSlot('heros');

                if (!hero) {
                    this.nlu.ask('hero');
                    //  let card = new Bot.Card.TextCard('你工资多少呢');

                    //  如果有异步操作，可以返回一个promise
                    return new Promise(function (resolve, reject) {
                        resolve({
                            directives: [this.getTemplate1('请说您查询的英雄是谁')],
                            outputSpeech: '请说您查询的英雄是谁'
                        });
                    });
                }
                return {
                    directives: [this.getTemplate1(hero + '的技能是闪烁突袭!!!') ],
                    outputSpeech: ''
                }

            });
    }
    /**
     *  获取文本展现模板
     *
     *  @param {string} text 歌曲详情
     *  @return {RenderTemplate} 渲染模版
     */
    getTemplate1(text) {
        let bodyTemplate = new BaseBot.Directive.Display.Template.BodyTemplate1();
        bodyTemplate.setPlainTextContent(text);
        let renderTemplate = new BaseBot.Directive.Display.RenderTemplate(bodyTemplate);
        return renderTemplate;
    }
}
module.exports = Bot

