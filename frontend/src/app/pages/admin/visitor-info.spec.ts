import { countryName, flag, parseUserAgent, refHost, toCsv, zoneCity } from './visitor-info';

describe('visitor-info', () => {
  it('reads browser, system and device from common user agents', () => {
    const win = parseUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    expect(win).toEqual({ browser: 'Chrome 131', os: 'Windows', device: 'desktop' });
    const iphone = parseUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1');
    expect(iphone).toEqual({ browser: 'Safari 17', os: 'iOS', device: 'mobile' });
    const edge = parseUserAgent('Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 Edg/130.0');
    expect(edge.browser).toBe('Edge 130');
  });

  it('marks crawlers as bots', () => {
    expect(parseUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)').device).toBe('bot');
  });

  it('formats countries, places and referrers', () => {
    expect(flag('BR')).toBe('🇧🇷');
    expect(flag(null)).toBe('');
    expect(countryName('DE', 'pt')).toBe('Alemanha');
    expect(zoneCity('America/Sao_Paulo')).toBe('Sao Paulo');
    expect(refHost('https://www.linkedin.com/feed/')).toBe('www.linkedin.com');
  });

  it('quotes CSV cells that need it', () => {
    expect(toCsv(['a', 'b'], [['x,y', 'say "hi"']])).toBe('a,b\n"x,y","say ""hi"""');
  });
});
