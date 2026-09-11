import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';
dotenv.config();

const baseData = [
    { c: 'Electronics', i: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800', p: 'MacBook Pro M2 Ultimate', d: 'The most powerful laptop for creators. Liquid Retina display ensures accurate colors.' },
    { c: 'Electronics', i: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800', p: 'Dell XPS 15 OLED', d: 'InfinityEdge display and incredible power. Built for premium computing.' },
    { c: 'Electronics', i: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800', p: 'Apple iMac 24" M3', d: 'Stunning design and M3 performance. The best all in one machine in the world.' },
    { c: 'Electronics', i: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800', p: 'Microsoft Surface Studio 2', d: 'The ultimate creative workstation for designers. Foldable pixel sense display.' },
    { c: 'Electronics', i: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800', p: 'iPad Pro 12.9" Pro-Motion', d: 'Liquid Retina XDR display with M2 chip. Complete standalone processing platform.' },
    { c: 'Electronics', i: 'https://images.unsplash.com/photo-1588702545922-7628d6d84fbb?auto=format&fit=crop&q=80&w=800', p: 'Razer Blade 16 Titanium', d: 'Desktop level gaming performance inside a sleek unibody chassis engineered for gamers.' },
    { c: 'Electronics', i: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?auto=format&fit=crop&q=80&w=800', p: 'LG OLED Smart TV 65"', d: 'Perfect blacks and infinite contrast with evo panel technology. True cinematic colors.' },
    { c: 'Electronics', i: 'https://images.unsplash.com/photo-1599540822606-1216d68b7522?auto=format&fit=crop&q=80&w=800', p: 'Sony A7 IV Core Camera', d: 'Full-frame mirrorless excellence with completely uncapped 4K recording capabilities.' },
    { c: 'Electronics', i: 'https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&q=80&w=800', p: 'PlayStation 5 Console', d: 'Next generation gaming rendering up to 120 FPS natively in stunning HDR environments.' },
    { c: 'Electronics', i: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=800', p: 'DJI Mavic 3 Pro Drone', d: 'Hasselblad camera drone capturing 5.1K video flawlessly from maximum altitude.' },

    { c: 'Audio', i: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', p: 'Sony WH-1000XM5 Black', d: 'Industry leading noise cancellation in a totally refreshed body. Long lasting premium battery.' },
    { c: 'Audio', i: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800', p: 'AirPods Max Space Gray', d: 'High-fidelity audio with true spatial sound. Unmatched build quality using anodized aluminum.' },
    { c: 'Audio', i: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800', p: 'AirPods Pro 2 Type-C', d: 'Active Noise Cancellation and upgraded Transparency. USB-C convenience directly in the case.' },
    { c: 'Audio', i: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800', p: 'Bose QuietComfort Earbuds II', d: 'World-class noise cancellation dynamically customized to your ear shape perfectly.' },
    { c: 'Audio', i: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?auto=format&fit=crop&q=80&w=800', p: 'Sonos Roam Smart Speaker', d: 'Portable, powerful smart speaker perfectly integrating with Google and Alexa via WiFi.' },
    { c: 'Audio', i: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&q=80&w=800', p: 'Marshall Stanmore II Amp', d: 'Classic design reminiscent of true amplifier heritage. Delivering massive clear analogue sound.' },
    { c: 'Audio', i: 'https://images.unsplash.com/photo-1505236273191-1dce886b01e9?auto=format&fit=crop&q=80&w=800', p: 'Jabra Elite 85t Advanced', d: 'Advanced ANC paired seamlessly with 12mm speakers providing heavy bass responses natively.' },
    { c: 'Audio', i: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800', p: 'Sennheiser Momentum 4 Pro', d: 'Exceptional 60-hour massive battery life designed heavily for long-haul audio enthusiasts.' },
    { c: 'Audio', i: 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?auto=format&fit=crop&q=80&w=800', p: 'Audio-Technica ATH-M50x', d: 'Professional studio monitor headphones widely praised by top engineers across the music globe.' },
    { c: 'Audio', i: 'https://images.unsplash.com/photo-1520170350707-b2da59f7b102?auto=format&fit=crop&q=80&w=800', p: 'Samsung Galaxy Buds2 Pro', d: '24-bit Hi-Fi audio experience locking extremely secure into the ear profile seamlessly.' },

    { c: 'Wearables', i: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800', p: 'Apple Watch Ultra Trail', d: 'Rugged and fully capable adventure machine built natively in raw aerospace titanium material.' },
    { c: 'Wearables', i: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800', p: 'Apple Watch Series 9 Aluminum', d: 'Brighter screen and incredibly accurate double tap gestures natively powered by the S9 module.' },
    { c: 'Wearables', i: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800', p: 'Samsung Galaxy Watch 6 LTE', d: 'Advanced sleep tracking natively integrating deeply inside the robust Samsung health ecosystem.' },
    { c: 'Wearables', i: 'https://images.unsplash.com/photo-1617625802912-c0f524a87a70?auto=format&fit=crop&q=80&w=800', p: 'Google Pixel Watch 2 Obsidian', d: 'Deep Fitbit integration placed beautifully inside an edge to edge dome custom housing build.' },
    { c: 'Wearables', i: 'https://images.unsplash.com/photo-1509741102003-ca64bfe5f069?auto=format&fit=crop&q=80&w=800', p: 'Garmin Fenix 7 Pro Solar', d: 'Solar powered multisport watch tracking absolutely every metric for the true hardcore marathoner.' },
    { c: 'Wearables', i: 'https://images.unsplash.com/photo-1572569432794-7b70bc92f397?auto=format&fit=crop&q=80&w=800', p: 'Oura Ring Gen3 Horizon', d: 'Discreet health monitoring delivering daily readiness metrics via advanced embedded optics array.' },
    { c: 'Wearables', i: 'https://images.unsplash.com/photo-1512499617621-0a6dd249c5e3?auto=format&fit=crop&q=80&w=800', p: 'Fitbit Charge 6 Band', d: 'Advanced fitness band featuring onboard Google Maps and heart rate broadcasting to gym tools.' },
    { c: 'Wearables', i: 'https://images.unsplash.com/photo-1523473827532-6af116c5b28e?auto=format&fit=crop&q=80&w=800', p: 'Suunto 9 Baro Adventure', d: 'Ultra-endurance GPS watch handling up to 120 continuous hours tracking exactly where you go.' },
    { c: 'Wearables', i: 'https://images.unsplash.com/photo-1518118014377-ce95efdb3073?auto=format&fit=crop&q=80&w=800', p: 'Whoop 4.0 Subscribtion Band', d: 'Personalized fitness and strain coach ensuring you are pushing precisely your personal limits.' },
    { c: 'Wearables', i: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?auto=format&fit=crop&q=80&w=800', p: 'Withings ScanWatch Horizon', d: 'Hybrid smartwatch generating real ECG and deeply analyzing sleep states in titanium finish.' },

    { c: 'Accessories', i: 'https://images.unsplash.com/photo-1629891223963-3dc89aeeb458?auto=format&fit=crop&q=80&w=800', p: 'Logitech MX Master 3S Mouse', d: 'Advanced precision mouse heavily utilized by creative coding environments universally globally.' },
    { c: 'Accessories', i: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800', p: 'Keychron Q1 Pro Wireless', d: 'Custom mechanical keyboard delivering ultra-satisfying tactile feedback entirely wireless ready.' },
    { c: 'Accessories', i: 'https://images.unsplash.com/photo-1605335035252-78d1fbfa7038?auto=format&fit=crop&q=80&w=800', p: 'Anker 737 PowerBank 140W', d: '140W fast portable charging delivering full laptop recharges effortlessly on long haul travel.' },
    { c: 'Accessories', i: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800', p: 'Magic Keyboard for iPad Black', d: 'Supreme typing and trackpad experience radically transforming the heavy tablet workflows entirely.' },
    { c: 'Accessories', i: 'https://images.unsplash.com/photo-1584000305118-2adac8d4cb2c?auto=format&fit=crop&q=80&w=800', p: 'Samsung T7 Shield SSD 2TB', d: 'Rugged portable storage pushing hyper-fast read speeds surviving massive heavy drop failures.' },
    { c: 'Accessories', i: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&q=80&w=800', p: 'Nomad Base One Max White', d: 'Premium weighted MagSafe charger locking standard iPhones easily into seamless upright posture.' },
    { c: 'Accessories', i: 'https://images.unsplash.com/photo-1600080888995-1775f0a0d481?auto=format&fit=crop&q=80&w=800', p: 'Elgato Stream Deck MK.2', d: 'Custom tactile control interface launching massive macro chains dramatically fast inside OBS suites.' },
    { c: 'Accessories', i: 'https://images.unsplash.com/photo-1628173426742-1e921d25bedf?auto=format&fit=crop&q=80&w=800', p: 'Sony CFexpress Type A 80GB', d: 'Ultra-fast memory card handling raw untethered massive dense 4K and native 8K cinema recordings.' },
    { c: 'Accessories', i: 'https://images.unsplash.com/photo-1631580970631-f9db8e2d7d2a?auto=format&fit=crop&q=80&w=800', p: 'Apple AirTag 4-Pack Precision', d: 'Keep strict physical tracking precision on everything via massively crowdsourced Apple secure networks.' },
    { c: 'Accessories', i: 'https://images.unsplash.com/photo-1592813583279-d1bdad28b2be?auto=format&fit=crop&q=80&w=800', p: 'Belkin Thunderbolt 4 Pro Dock', d: 'Ultimate bandwidth connectivity hub managing multi-monitor daisy chains natively perfectly cleanly.' },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Product.deleteMany({});
        console.log('Cleared existing products');

        for (let item of baseData) {
            const prod = new Product({
                name: item.p,
                description: item.d,
                price: Math.floor(Math.random() * 95000) + 1499,
                category: item.c,
                image: item.i,
                stock: Math.floor(Math.random() * 50) + 5,
            });
            await prod.save();
        }

        console.log('Seeded 40 Premium Products successfully!');
    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        mongoose.disconnect();
    }
}
seed();
