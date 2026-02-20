export interface GateQuestion {
  planetId: number;
  planetName: string;
  gateId: number;
  quesId: number;
  dds: number;
  target: string;
  distractors: string[];
}

// Kelimeler.csv dosyasındaki master veriler (Full Sync)
const rawCsv = `Planet_ID,Planet_Name,Gate_ID,Ques_ID,DDS,Target_Word,Dist_1,Dist_2,Dist_3
1,Dünya,1,1,1.15,zirve,kirve,sirke,gazve
1,Dünya,1,2,1.15,durma,dürme,derme,durgu
1,Dünya,1,3,1.15,mazak,mazur,hazar,varak
1,Dünya,1,4,1.15,metil,meyil,celil,zeyil
1,Dünya,1,5,1.15,ihzar,inzal,ibzal,yazar
1,Dünya,2,6,1.18,galon,salon,yalan,palan
1,Dünya,2,7,1.18,maviş,yavaş,manca,taziz
1,Dünya,2,8,1.18,zilli,pilli,killi,dişli
1,Dünya,2,9,1.18,ahali,afili,muhal,calip
1,Dünya,2,10,1.18,bukle,buket,böyle,şeklî
1,Dünya,3,11,1.21,çiriş,çiziş,siliş,siniş
1,Dünya,3,12,1.21,gazel,gamze,gizil,gazap
1,Dünya,3,13,1.21,gezme,gülme,deşme,tezce
1,Dünya,3,14,1.21,parke,şarkı,paket,barka
1,Dünya,3,15,1.21,yayma,tatma,rayba,hayta
1,Dünya,4,16,1.24,zinhar,dindar,binkat,zafran
1,Dünya,4,17,1.24,doygun,duygun,bozgun,yorgun
1,Dünya,4,18,1.24,grafik,statik,arktik,frikik
1,Dünya,4,19,1.24,tensik,genlik,tetkik,benlik
1,Dünya,4,20,1.24,Zazaca,kabaca,kazara,karaca
1,Dünya,5,21,1.27,İncesu,şecere,hececi,beceri
1,Dünya,5,22,1.27,çekmek,çıkmak,deşmek,vermek
1,Dünya,5,23,1.27,müzeci,lüleci,düzeme,tefeci
1,Dünya,5,24,1.27,sağdıç,dağlık,sağlam,safdil
1,Dünya,5,25,1.27,şamalı,tasalı,kafalı,sıvalı
1,Dünya,6,26,1.3,esatir,santim,eritiş,editör
1,Dünya,6,27,1.3,sorgun,solgun,sirrus,sosluk
1,Dünya,6,28,1.3,edinim,adilik,dinsiz,dizici
1,Dünya,6,29,1.3,gökyüzü,güldürü,gönüllü,görüngü
1,Dünya,6,30,1.3,sayıltı,sayılış,yayılma,kayıkçı
2,Mars,7,31,1.33,çantacı,pastacı,çalmacı,postacı
2,Mars,7,32,1.33,türümcü,dürümcü,bürgülü,taramak
2,Mars,7,33,1.33,ruzuşeb,tutuşma,rezalet,kazulet
2,Mars,7,34,1.33,olunmak,ovulmak,acınmak,bulunma
2,Mars,7,35,1.33,sihirli,giyimli,sitemli,bitimli
2,Mars,8,36,1.36,asistan,esastan,inisyal,atılgan
2,Mars,8,37,1.36,allamak,aklamak,aylamak,otlamak
2,Mars,8,38,1.36,ayrılış,alçalış,aşçılık,atlatış
2,Mars,8,39,1.36,imrenme,beğenme,eklenme,yerinme
2,Mars,8,40,1.36,seloteyp,senozoik,asaleten,betatron
2,Mars,9,41,1.39,cartadak,parlamak,karlamak,kanlamak
2,Mars,9,42,1.39,başçavuş,martaval,çağlayış,Başmakçı
2,Mars,9,43,1.39,istikbal,istimdat,istimbot,istihkâm
2,Mars,9,44,1.39,uğursama,uğuldama,doğurtma,oturuşma
2,Mars,9,45,1.39,fatalite,fatalist,aktivite,paralizi
2,Mars,10,46,1.42,musallat,mugalata,müstezat,mukattar
2,Mars,10,47,1.42,falakalı,Kanadalı,kabaklık,tatavacı
2,Mars,10,48,1.42,agronomi,antinomi,biyoşimi,endogami
2,Mars,10,49,1.42,Kırıkkale,vıcıklama,başmakale,Karaisalı
2,Mars,10,50,1.42,fakirhane,şaraphane,başlahana,klişehane
3,Jüpiter,13,61,1.51,getiriliş,mesirelik,behimilik,terecilik
3,Jüpiter,13,62,1.51,hanımsever,konuksever,silisseven,fışkırtıcı
4,Satürn,19,91,1.75,dizdirilmek,deldirilmek,tiksinilmek,hissedilmek
5,Uranüs,25,121,1.85,mavihastalık,badanasızlık,avantasızlık,nişastacılık
6,Neptün,31,151,1.95,kafeslemek,affeylemek,köpeklemek,maskelemek
7,Merkür,37,181,2.05,benekli,seferli,yemekçi,bademli
8,Venüs,43,211,2.15,atıştırma,atıştırış,arındırma,astırılma
9,Plüton,49,241,2.25,remiks,relaks,kemlik,nemcil
10,Aetheria,55,271,2.35,seğirtmek,geğirtmek,delirtmek,dedirtmek
11,Borealis,61,301,2.45,kanuni,fangri,kanara,kareli
12,Cryon,67,331,2.55,çabukça,çalışma,mahunya,hukukçu
13,Drakonis,73,361,2.65,katlayış,kutlanış,kaynayış,çıtlatış
21,Lumina,121,601,2.8,biyel,binek,misel,viyol
100,Lumina,600,3000,3.0,kişiliklilik,niteliklilik,Denizlililik,çelişkililik`;

// parse the raw csv data into objects
const parseData = (): GateQuestion[] => {
  const lines = rawCsv.trim().split('\n');
  return lines.slice(1).map(line => {
    const parts = line.split(',');
    return {
      planetId: parseInt(parts[0]),
      planetName: parts[1],
      gateId: parseInt(parts[2]),
      quesId: parseInt(parts[3]),
      dds: parseFloat(parts[4]),
      target: parts[5],
      distractors: [parts[6], parts[7], parts[8]]
    };
  });
};

const allQuestions = parseData();

// WordDatabase object to handle data requests from the UI
export const WordDatabase = {
  // Returns all questions in the database
  getAllQuestions: () => allQuestions,
  
  // Returns questions filtered by gate ID
  getQuestionsForGate: (gateId: number): GateQuestion[] => {
    return allQuestions.filter(q => q.gateId === gateId);
  },

  // Returns the Difficulty Dynamic Scale (DDS) for a specific gate
  getDDSForGate: (gateId: number): number => {
    const questions = allQuestions.filter(q => q.gateId === gateId);
    return questions.length > 0 ? questions[0].dds : 1.0;
  },

  // Returns a unique list of planets present in the database
  getAllPlanets: () => {
    const planetsMap = new Map<number, { id: number, name: string }>();
    allQuestions.forEach(q => {
      if (!planetsMap.has(q.planetId)) {
        planetsMap.set(q.planetId, { id: q.planetId, name: q.planetName });
      }
    });
    return Array.from(planetsMap.values());
  }
};