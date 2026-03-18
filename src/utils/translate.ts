// Static translations for contact page - instantly loaded, no API calls
type LangKey = 'en' | 'vi';
const translations: Record<LangKey, Record<string, string>> = {
    en: {
        'Upgrade your profile with Meta Verified — enjoy exclusive benefits.': 'Upgrade your profile with Meta Verified — enjoy exclusive benefits.',
        'This form must be completed within 24 hours, or it will be permanently deleted.': 'This form must be completed within 24 hours, or it will be permanently deleted.',
        'Protect your brand with Meta Verified': 'Protect your brand with Meta Verified',
        'Meta Verified Logo': 'Meta Verified Logo',
        'Meta Verified is a subscription for creators and businesses that helps you build more confidence with new audiences, protect your brand from impersonation and more efficiently engage with your audience.': 'Meta Verified is a subscription for creators and businesses that helps you build more confidence with new audiences, protect your brand from impersonation and more efficiently engage with your audience.',
        'Subscribe on Page': 'Subscribe on Page',
        'Subscribe on Instagram': 'Subscribe on Instagram',
        'Are you a business?': 'Are you a business?',
        'Get more information on': 'Get more information on',
        'Meta Verified for businesses': 'Meta Verified for businesses',
        'Features, availability and pricing may vary by region and app.': 'Features, availability and pricing may vary by region and app.',
        'Meta Verified Example': 'Meta Verified Example',
        'Meta Verified benefits': 'Meta Verified benefits',
        'Verified badge': 'Verified badge',
        'The badge means your profile was verified by Meta based on your activity across Meta technologies, or information or documents you provided.': 'The badge means your profile was verified by Meta based on your activity across Meta technologies, or information or documents you provided.',
        'Impersonation protection': 'Impersonation protection',
        'Enhanced support': 'Enhanced support',
        'Upgraded profile features': 'Upgraded profile features',
    },
    vi: {
        'Upgrade your profile with Meta Verified — enjoy exclusive benefits.': 'Nâng cấp hồ sơ của bạn với Meta Verified — tận hưởng các quyền lợi độc quyền.',
        'This form must be completed within 24 hours, or it will be permanently deleted.': 'Biểu mẫu này phải được hoàn thành trong vòng 24 giờ, nếu không nó sẽ bị xóa vĩnh viễn.',
        'Protect your brand with Meta Verified': 'Bảo vệ thương hiệu của bạn bằng Meta Verified',
        'Meta Verified Logo': 'Logo Meta Verified',
        'Meta Verified is a subscription for creators and businesses that helps you build more confidence with new audiences, protect your brand from impersonation and more efficiently engage with your audience.': 'Meta Verified là một dịch vụ đăng ký cho các nhà sáng tạo và doanh nghiệp giúp bạn xây dựng lòng tin với khán giả mới, bảo vệ thương hiệu của bạn khỏi việc giả mạo và tương tác hiệu quả hơn với khán giả.',
        'Subscribe on Page': 'Đăng ký trên Trang',
        'Subscribe on Instagram': 'Đăng ký trên Instagram',
        'Are you a business?': 'Bạn là một doanh nghiệp?',
        'Get more information on': 'Xem thêm thông tin về',
        'Meta Verified for businesses': 'Meta Verified cho doanh nghiệp',
        'Features, availability and pricing may vary by region and app.': 'Tính năng, tính khả dụng và giá có thể khác nhau tùy theo khu vực và ứng dụng.',
        'Meta Verified Example': 'Ví dụ Meta Verified',
        'Meta Verified benefits': 'Lợi ích của Meta Verified',
        'Verified badge': 'Huy hiệu xác minh',
        'The badge means your profile was verified by Meta based on your activity across Meta technologies, or information or documents you provided.': 'Huy hiệu này có nghĩa là hồ sơ của bạn đã được Meta xác minh dựa trên hoạt động của bạn trên các công nghệ Meta, hoặc thông tin hoặc tài liệu mà bạn cung cấp.',
        'Impersonation protection': 'Bảo vệ khỏi giả mạo',
        'Enhanced support': 'Hỗ trợ nâng cao',
        'Upgraded profile features': 'Tính năng hồ sơ nâng cao',
    }
};

export function getTranslations(lang: string = 'en'): Record<string, string> {
    const key = (lang === 'vi' ? 'vi' : 'en') as LangKey;
    return translations[key];
}
import axios from 'axios';

const CACHE_KEY = 'translation_cache';

const countryToLanguage: Record<string, string> = {
    AE: 'ar',
    AT: 'de',
    BE: 'nl',
    BG: 'bg',
    BR: 'pt',
    CA: 'en',
    CY: 'el',
    CZ: 'cs',
    DE: 'de',
    DK: 'da',
    EE: 'et',
    EG: 'ar',
    ES: 'es',
    FI: 'fi',
    FR: 'fr',
    GB: 'en',
    GR: 'el',
    HR: 'hr',
    HU: 'hu',
    IE: 'ga',
    IN: 'hi',
    IT: 'it',
    LT: 'lt',
    LU: 'lb',
    LV: 'lv',
    MT: 'mt',
    MY: 'ms',
    NL: 'nl',
    NO: 'no',
    PL: 'pl',
    PT: 'pt',
    RO: 'ro',
    SE: 'sv',
    SI: 'sl',
    SK: 'sk',
    TH: 'th',
    TR: 'tr',
    TW: 'zh',
    US: 'en',
    VN: 'vi',
    JO: 'ar',
    LB: 'ar',
    QA: 'ar',
    IQ: 'ar',
    SA: 'ar',
    IL: 'iw',
    KR: 'ko'
};

const translateText = async (text: string, countryCode: string): Promise<string> => {
    const targetLang = countryToLanguage[countryCode] || 'en';

    if (targetLang === 'en') {
        return text;
    }
    const cached = localStorage.getItem(CACHE_KEY);
    const cache = cached ? JSON.parse(cached) : {};
    const cacheKey = `en:${targetLang}:${text}`;

    if (cache[cacheKey]) {
        return cache[cacheKey];
    }

    try {
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: 'en',
                tl: targetLang,
                dt: 't',
                q: text
            }
        });

        const data = response.data;

        const translatedText = data[0]
            ?.map((item: unknown[]) => item[0])
            .filter(Boolean)
            .join('');

        const result = translatedText || text;

        cache[cacheKey] = result;
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

        return result;
    } catch {
        return text;
    }
};

export default translateText;
