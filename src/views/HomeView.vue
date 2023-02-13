<script setup>
const emit = defineEmits(["errore", "info", "successo"]);
</script>

<template>
    <main>
        <h2>Sei nella home</h2>
        <!-- TODO aggiungere contenuti della home -->
        <button
            type="button"
            @click="emit('errore', 'Popup di errore', 'Hai appena creato un popup di errore!')">
            Lancia errore
        </button>
        <button
            type="button"
            @click="emit('info', 'Popup di info', 'Hai appena creato un popup informativo!')">
            Lancia info
        </button>
        <button
            type="button"
            @click="
                emit(
                    'successo',
                    'Popup di conferma',
                    'Hai appena creato un popup di conferma! Lorem ièsum dolor siwefaha bh fjohafb afohbb aohfbaof hadaos h baoh bah basd oadh badhsdh basd habd hsabd ashdb hsbdahsd dashd basb adkh absd ahdb akdhj badkh ab Lorem ièsum dolor siwefaha bh fjohafb afohbb aohfbaof hadaos h baoh bah basd oadh badhsdh basd habd hsabd ashdb hsbdahsd dashd basb adkh absd ahdb akdhj badkh ab Lorem ièsum dolor siwefaha bh fjohafb afohbb aohfbaof hadaos h baoh bah basd oadh badhsdh basd habd hsabd ashdb hsbdahsd dashd basb adkh absd ahdb akdhj badkh abLorem ièsum dolor siwefaha bh fjohafb afohbb aohfbaof hadaos h baoh bah basd oadh badhsdh basd habd hsabd ashdb hsbdahsd dashd basb adkh absd ahdb akdhj badkh ab'
                )
            ">
            Lancia successo
        </button>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tristique pretium
            libero, nec porttitor dolor consequat at. Suspendisse gravida libero ac efficitur
            porttitor. Sed vel risus accumsan, finibus lacus id, aliquet dolor. Sed porta vestibulum
            odio, in ullamcorper sem volutpat id. Curabitur ligula diam, fermentum in nunc tempor,
            suscipit pretium orci. Sed ut justo placerat, consequat urna at, sodales enim. Ut massa
            turpis, euismod eget nulla eget, fermentum feugiat felis. Maecenas semper fermentum
            egestas. Ut magna diam, molestie vel rhoncus sed, ullamcorper vel mi. Nunc pretium leo
            vel nibh pulvinar, quis tincidunt ex cursus. Fusce magna nunc, lobortis imperdiet dictum
            et, bibendum efficitur ligula. Proin pharetra tellus massa, at tristique massa suscipit
            vitae. Aliquam mollis porttitor elit. Quisque eleifend urna ac nulla vehicula cursus.
            Vestibulum vehicula lorem sed varius ultrices. Maecenas ligula est, imperdiet et dapibus
            ut, condimentum eu nulla. Quisque ut ornare libero. Aenean ac diam et elit tincidunt
            interdum. Mauris eu erat a elit pulvinar interdum. Sed a ultricies elit. Nulla
            consectetur faucibus blandit. Proin sit amet mi eu est malesuada lacinia eget
            scelerisque justo. Praesent tortor leo, bibendum non commodo nec, laoreet nec tortor.
            Praesent vehicula molestie eros, id ultricies ipsum blandit a. Sed a lacus sodales,
            commodo nunc sed, ultrices orci. In accumsan et leo id consectetur. Vivamus
            pellentesque, velit non pulvinar tristique, leo erat ultrices ex, non venenatis ex
            ligula id ligula. Nam vel dolor pretium tellus luctus ultrices et ac velit. Nulla tempus
            tortor quis arcu interdum, fringilla eleifend nibh bibendum. Nulla maximus cursus
            tincidunt. Fusce commodo nunc nisl, et varius eros pellentesque nec. Nam porttitor
            laoreet congue. Cras sit amet leo consectetur, ornare elit eu, ornare turpis. Morbi
            maximus elit mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae; Fusce quis velit nisi. Phasellus semper nisi nec posuere aliquet.
            Suspendisse potenti. Nulla consequat cursus lectus nec condimentum. Fusce aliquam eu
            justo a cursus. In eu convallis metus, id congue erat. Donec sagittis pulvinar
            dignissim. Ut scelerisque, dolor ut congue aliquam, erat tellus auctor libero, ut
            hendrerit est nisl et lectus. Suspendisse sit amet odio ut metus dignissim tristique.
            Duis eget mi molestie, congue dui eget, dictum diam. Vestibulum a dolor malesuada,
            accumsan mi vitae, lobortis sem. Proin ultricies quis sapien vitae posuere. Sed interdum
            dictum ante, ut consequat orci fringilla vel. Quisque ultricies ex vel dictum auctor.
            Vivamus lobortis, nulla sit amet semper convallis, neque enim tincidunt diam, a
            ullamcorper sem erat id eros. Proin laoreet convallis est. Aliquam erat volutpat. Aenean
            augue felis, hendrerit vel sodales id, sollicitudin at tortor. Suspendisse quis nisi
            condimentum, porttitor odio lacinia, posuere tellus. Sed pharetra ligula eros, vitae
            suscipit tortor porta vitae. Suspendisse vitae cursus libero, eu tincidunt mauris.
            Aliquam erat volutpat. Mauris rutrum lectus nec varius facilisis. Pellentesque lobortis
            neque sit amet nisl sagittis congue. Ut accumsan varius risus quis viverra. Cras
            efficitur facilisis ultricies. Phasellus ac malesuada est. Nam convallis sagittis
            ligula, vitae consectetur magna maximus eu. In bibendum ante efficitur tristique
            tincidunt. Nulla maximus augue eget elit imperdiet tincidunt. Pellentesque lectus dolor,
            scelerisque vel mauris ut, finibus vulputate ipsum. Cras tempus in sapien ac sodales.
            Maecenas sodales vel leo vitae egestas. Sed eget risus sit amet eros aliquam pharetra
            ullamcorper at mauris. Suspendisse potenti. Pellentesque habitant morbi tristique
            senectus et netus et malesuada fames ac turpis egestas. Aenean quis lacinia diam. Fusce
            quis lectus porttitor, luctus ex molestie, vehicula leo. Praesent efficitur pulvinar
            nibh, at pulvinar nisi vehicula non. Duis vehicula magna sed diam hendrerit cursus.
            Vivamus ultricies, lacus et commodo mattis, sapien erat aliquet arcu, ut ullamcorper
            libero leo ut lacus. Suspendisse euismod urna erat, ut aliquet elit pulvinar ut. Duis
            rhoncus cursus metus, sed bibendum eros pharetra in. Proin bibendum facilisis odio vel
            condimentum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut gravida
            neque nisl, vel dignissim mauris ornare eget. Aliquam erat volutpat. Donec accumsan
            lacus sit amet metus facilisis, et luctus tellus rutrum. Pellentesque habitant morbi
            tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur consectetur
            congue elementum. Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas. Etiam lobortis egestas ipsum ac consequat. Sed a nisl nec neque
            semper aliquam sit amet eu orci. Sed feugiat commodo arcu, consectetur suscipit odio
            gravida eu. In cursus, metus vel pulvinar molestie, nisl mi viverra enim, at aliquet mi
            lectus ac arcu. Donec vestibulum leo vel convallis aliquet. Donec venenatis convallis
            nisl, ac fermentum dolor fermentum eget. Ut sem arcu, faucibus ac mi at, finibus
            ultrices libero. Proin ultricies neque sit amet sapien fermentum gravida. Donec interdum
            mauris vel justo condimentum vehicula ac quis dui. Praesent fermentum, metus sodales
            auctor consequat, felis tellus pulvinar purus, nec congue libero augue quis sapien.
            Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
            himenaeos. Quisque at eleifend nunc, vitae sodales est. In hac habitasse platea
            dictumst. Pellentesque eget feugiat erat, id venenatis sapien. Sed ut neque egestas,
            imperdiet erat ac, consectetur lectus. Curabitur sit amet ullamcorper urna, sit amet
            eleifend tortor. Vestibulum in maximus nibh, ac semper tellus. Phasellus auctor sapien
            sed augue rutrum lacinia. Etiam at magna lacinia, vehicula nibh sed, vehicula arcu.
            Aliquam erat volutpat. Curabitur maximus interdum urna, non accumsan ex pulvinar ac.
            Proin posuere finibus mi ac hendrerit. Nulla ultricies molestie ultrices. Nullam eu
            tincidunt ipsum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae; Nunc ultrices egestas faucibus. Donec ultrices risus non commodo
            condimentum. Vestibulum porttitor leo nibh, vitae elementum risus volutpat eleifend.
            Phasellus dapibus urna sit amet magna semper, blandit vulputate dui pulvinar. Nulla
            libero dolor, pellentesque non justo id, dignissim congue metus. Nunc ut lobortis nibh,
            placerat mattis leo. Sed tempus, nisi dignissim sagittis fringilla, purus elit venenatis
            quam, in blandit magna dolor id arcu. Maecenas lectus dolor, fermentum id finibus vel,
            rhoncus sit amet diam. Sed eleifend, magna eget laoreet rutrum, augue turpis tincidunt
            lorem, id mattis est velit eget est. Interdum et malesuada fames ac ante ipsum primis in
            faucibus. Proin sollicitudin risus vitae posuere feugiat. Phasellus aliquet vitae felis
            vel condimentum. Nulla facilisis magna in ultrices condimentum. Quisque rutrum mi dui,
            non viverra lacus sollicitudin sit amet. Aliquam ornare felis vel mattis commodo. Ut
            euismod metus sed dolor vehicula sollicitudin. Vestibulum tincidunt lectus in metus
            bibendum, a varius neque accumsan. Nam nec arcu consequat, sagittis dui sit amet,
            elementum ex. Nam eget quam posuere arcu sollicitudin pellentesque sit amet et odio.
            Etiam at finibus libero. Vestibulum consectetur dolor id tincidunt finibus. Nunc commodo
            facilisis nisi, vel scelerisque urna. Nullam vitae semper libero, et facilisis purus.
            Vivamus non fermentum massa, at ultrices diam. Morbi ante leo, tincidunt sit amet
            egestas sed, condimentum at felis. Quisque id dui quis odio bibendum interdum. Nunc
            porttitor eget est eget placerat. Aliquam metus elit, blandit sed pellentesque et,
            volutpat et ligula. Mauris volutpat libero in interdum ornare. Aliquam convallis nisi
            dolor, id feugiat lacus cursus sit amet. Proin eget libero non mi mattis eleifend.
            Phasellus in tempus augue, ut tempor turpis. Quisque viverra arcu id tristique cursus.
            Etiam nisi arcu, scelerisque et metus id, pharetra fermentum dolor. Etiam lacinia augue
            at molestie dapibus. Sed vel nibh at sem vulputate consequat. Aliquam a interdum odio.
            Etiam cursus velit in libero finibus, id pulvinar ex semper. Aliquam erat volutpat. Ut
            neque elit, elementum eget elementum a, finibus a nisi. Phasellus ut ex sed justo varius
            placerat non ac orci. Nulla sit amet tincidunt odio. Integer efficitur nulla in maximus
            efficitur. Cras nec sodales ipsum. In finibus ipsum in dui posuere, ut pharetra ligula
            vestibulum. Integer ultricies vehicula turpis, aliquet pharetra libero. Integer ac
            rhoncus nisi. Nam varius magna scelerisque tempor imperdiet. Curabitur a erat euismod,
            dignissim lorem sit amet, cursus justo. Sed porta sollicitudin placerat. Vestibulum
            pellentesque enim sit amet quam ultricies semper. Sed nibh erat, accumsan sed ipsum a,
            aliquet convallis neque. Praesent vel nibh ut neque pulvinar tempus sed quis nulla.
            Donec sit amet nisl mauris. Cras aliquet, metus ac viverra sollicitudin, quam urna
            facilisis diam, in lacinia urna felis quis odio. Suspendisse ac cursus tortor, vel
            dictum erat. Aliquam laoreet urna in bibendum dignissim. Maecenas neque orci, sodales in
            scelerisque ac, sollicitudin vel lacus. In pulvinar arcu sed leo laoreet commodo.
            Suspendisse ornare tellus vel leo luctus suscipit. Morbi ligula libero, dapibus sit amet
            rhoncus porttitor, finibus ut tellus. Morbi quis nisl quis massa congue placerat a eget
            dui. Nam viverra nec risus a dignissim. Curabitur rutrum ligula libero, lacinia
            malesuada urna dictum et. Orci varius natoque penatibus et magnis dis parturient montes,
            nascetur ridiculus mus. Quisque a tortor in ex consectetur vestibulum. Class aptent
            taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Orci
            varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi
            risus risus, maximus quis pellentesque id, gravida non tellus. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Cras non feugiat ex. Nulla sodales lectus vel
            eleifend mattis. Phasellus blandit ac mi sit amet ullamcorper. Duis ultrices eros quis
            elit accumsan pretium. Suspendisse vel felis a augue aliquam interdum. Vivamus pharetra
            ipsum quis tincidunt maximus. Morbi porta dolor non lectus tempus dapibus. Sed commodo
            tristique iaculis. Fusce luctus nibh vel ante consequat, non pellentesque augue tempor.
            Curabitur tortor dui, consectetur sed massa vitae, congue ornare sapien. Cras eu velit
            turpis. Nam vestibulum ligula massa, sed vestibulum nisl ornare vitae. Vivamus non
            cursus velit. Nunc vitae viverra odio. Aenean porttitor est odio, quis pulvinar odio
            varius ut. Etiam mattis, mauris et aliquet euismod, arcu metus interdum sem, nec
            dignissim massa tortor id purus. Vivamus facilisis ligula lacus, et cursus tellus
            aliquam vitae. Curabitur fringilla magna in dapibus viverra. Morbi magna dolor, molestie
            sit amet dui eu, rutrum porttitor ante. Maecenas porta lectus vel luctus sollicitudin.
            Mauris porttitor ante eget urna facilisis, nec pretium quam fermentum. Nulla semper
            purus non ex egestas aliquet. Maecenas consequat, risus sed cursus feugiat, odio nulla
            feugiat nisl, ac egestas est lacus et lorem. Ut rutrum imperdiet sem ut ullamcorper. Ut
            pulvinar, risus quis tincidunt elementum, libero nisl fringilla mi, non tempor neque
            lectus in nulla. Vestibulum et suscipit lectus, eget interdum tortor. Suspendisse
            convallis tincidunt dolor a finibus. Orci varius natoque penatibus et magnis dis
            parturient montes, nascetur ridiculus mus. Maecenas nec vestibulum risus, sit amet
            volutpat ex. Sed pellentesque nisi sem, at facilisis eros sollicitudin non. Morbi semper
            venenatis neque, et sodales quam molestie sed. In commodo magna libero. Nam id rhoncus
            augue. In congue enim blandit urna laoreet condimentum. Aliquam eget porta mi. Vivamus
            sit amet ex justo. Proin feugiat, enim et condimentum tincidunt, lacus risus convallis
            leo, eu eleifend ipsum erat sed odio. Phasellus dictum sed risus ac porttitor. Aenean
            nec condimentum dui. In molestie metus massa, ac auctor mauris auctor laoreet. Ut turpis
            orci, suscipit sit amet enim eu, tempor condimentum felis. Praesent et faucibus dolor,
            et vulputate est. Mauris convallis neque at tempus condimentum. Vivamus consequat rutrum
            aliquet. Fusce quis nunc sem. Nulla suscipit lectus odio, eget lobortis sapien rhoncus
            nec. Donec semper, enim et semper mattis, nisi neque interdum metus, at molestie massa
            sem et odio. In vel arcu condimentum, faucibus sem vel, tincidunt sem. Vestibulum quis
            ipsum ex. Pellentesque sagittis nulla nisl, nec molestie justo lobortis id. Etiam ut
            elementum sem, id placerat risus. Suspendisse venenatis lectus vitae lacus semper
            molestie id consectetur felis. In non viverra risus. Quisque dictum felis vitae posuere
            luctus. Duis eleifend cursus urna, hendrerit posuere dui bibendum eu. Sed eu neque sit
            amet nisl convallis tincidunt eu nec nulla. Proin sit amet risus gravida, congue tellus
            auctor, faucibus leo. Nam euismod bibendum eleifend. Aliquam erat volutpat. Duis id
            semper tellus, at tincidunt ex. Nulla facilisi. Phasellus viverra posuere dolor, cursus
            cursus velit luctus in. Integer consequat molestie justo, pretium molestie augue
            fringilla quis. Suspendisse vel ex nec erat tempus malesuada vitae nec neque.
        </p>
    </main>
</template>

<style>
/* TODO aggiungere il CSS della home */
</style>
