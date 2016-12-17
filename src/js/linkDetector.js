import _ from 'lodash'
import { load } from 'cheerio'

const GBK_DECODER = new TextDecoder('gbk');
const PROTOCOLS = {
    ed2k: {
        search: /ed2k:\/\/\|file\|.+?\//gi,
        decode(link) {
            let match = link.match(/ed2k:\/\/\|file\|(.+?)\|(.+?)\|.+?\//i);
            return {
                prefix: 'ed2k',
                name: match[0],
                size: match[2] | 0,
                decoded: null,
                url: link,
            };
        },
    },
    magnet: {
        search: /magnet:\?[^"]+/gi,
        decode(link) {
            let mName = link.match(/dn=(.+?)&/), mSize = link.match(/xl=(.+?)&/);
            return {
                prefix: 'magnet',
                name: mName ? mName[0] : '',
                size: mSize && (mSize[1] | 0),
                decoded: null,
                url: link,
            };
        },
    },
    thunder: {
        search: /thunder:\/\/([a-zA-Z0-9+\/]+={0,2})/gi,
        decode(link) {
            let match = link.match(/thunder:\/\/([a-zA-Z0-9+\/]+={0,2})/i);
            if (!match) return null;

            let gbk = atob(match[1]), len = gbk.length, buff = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                buff[i] = gbk[i].charCodeAt(0);
            }
            let mDecoded = GBK_DECODER.decode(buff).match(/AA(.+)ZZ/i);
            return {
                prefix: 'thunder',
                name: mDecoded ? mDecoded[1] : '',
                size: null,
                decoded: mDecoded ? mDecoded[1] : '',
                url: link,
            };
        },
    },
    flashget: {
        search: /flashget:\/\/([a-zA-Z0-9+\/]+={0,2})&\w+/gi,
        decode(link) {
            let match = link.match(/flashget:\/\/([a-zA-Z0-9+\/]+={0,2})&\w+/i);
            if (!match) return null;

            let gbk = atob(match[1]), len = gbk.length, buff = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                buff[i] = gbk[i].charCodeAt(0);
            }
            let mDecoded = GBK_DECODER.decode(buff).match(/\[FLASHGET\](.+)\[FLASHGET\]/i);
            return {
                prefix: 'flashget',
                name: mDecoded ? mDecoded[1] : '',
                size: null,
                decoded: mDecoded ? mDecoded[1] : '',
                url: link,
            };
        },
    },
    qqdl: {
        search: /qqdl:\/\/([a-zA-Z0-9+\/]+={0,2})/gi,
        decode(link) {
            let match = link.match(/qqdl:\/\/([a-zA-Z0-9+\/]+={0,2})/i);
            if (!match) return null;

            let gbk = atob(match[1]), len = gbk.length, buff = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                buff[i] = gbk[i].charCodeAt(0);
            }
            let mDecoded = GBK_DECODER.decode(buff);
            return {
                prefix: 'qqdl',
                name: mDecoded || '',
                size: null,
                decoded: mDecoded || '',
                url: link,
            };
        },
    },
};

const LINK_SELECTOR = ( () => _.map(_.keys(PROTOCOLS), (p) => `a[href^='${p}:']`).join(',') )();

function detectHrefLinks(html) {
    let $ = load(html), links = [];
    $(LINK_SELECTOR).each((i, el) => {
        let $el = $(el), href = $el.attr('href');
        _.each(PROTOCOLS, (protocol, prefix) => {
            if (!_.startsWith(href, prefix)) return;
            links.push({
                ...protocol.decode(href),
                title: $el.text().trim().replace(/\s{2,}/g, ' '),
            })
        })
    })
    return links;
}

function detectContentLinks(html) {
    let links = {};
    _.each(PROTOCOLS, (protocol, prefix) => {
        let handled = {}, group = links[prefix] = [];
        _.each(html.match(protocol.search) || [], (link) => {
            if (!handled[link]) {
                handled[link] = true;
                group.push(protocol.decode(link));
            }
        });
    })
    return links;
}

export default function detectLinks(html) {
    let hrefLinks = detectHrefLinks(html)
    , contentLinks = detectContentLinks(html)
    , linkDict = {};

    _.each(_.keys(PROTOCOLS), (prefix) => linkDict[prefix] = {})

    for (let { title, ...link } of hrefLinks) {
        let { titles, handled } = linkDict[link.prefix][link.url] || (linkDict[link.prefix][link.url] = { titles: [], handled: {}, link, });
        if (handled[title]) continue;

        // console.log(title)
        handled[title] = true;
        titles.push(title);
    }

    _.each(contentLinks, (links, prefix) => {
        let dict = linkDict[prefix];
        for (let link of links) {
            if (dict[link.url]) continue;

            dict[link.url] = {
                titles: [link.name],
                link,
            };
        }
        linkDict[prefix] = _.map(_.values(dict), ({titles, link}) => ({ ...link, titles: [...titles, link.url, link.name] }));
    })

    return {
        filters: _.keys(linkDict),
        links: _.flatten(_.values(linkDict)),
    };
}
