/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
//document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('deviceready', onDeviceReady, false);
var myapp
function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    myapp = Vue.createApp({
        data(){
            return{
                message: 'Liste de Pokémons',
                Description : [],
                offset:0,
                ShowDesc : false,
                isTrue :"",
                isFalse : false,
                PockemonChoisi : null,
                limit : 10
            }
        },
        methods: {
            async getData() {
                fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${this.offset}&limit=${this.limit}`)
                .then(res => res.json())
                .then(finalRes => {
                    this.Description = []
                    finalRes.results.forEach(pokemon =>{
                        fetch(pokemon.url)
                            .then(res2 => res2.json())
                            .then(finalRes2 => {
                                console.log(finalRes2)
                                const abilities = {}
                                abilities.Nom = finalRes2.name
                                abilities.HP = finalRes2.stats[0].base_stat
                                abilities.Capacites = finalRes2.moves[0].move.name
                                abilities.Weight = finalRes2.weight
                                abilities.Ability_name = finalRes2.abilities[0].ability.name
                                abilities.ImGSrc = finalRes2.sprites.front_default
                                abilities.ImgArtwork = finalRes2.sprites.other["official-artwork"].front_default
                                abilities.Cri = finalRes2.cries
                            this.Description.push(abilities)
                    })
                })
                });
              },
              
            async get10nextPokemons(){
                this.offset += this.limit;
                await this.getData();
                this.isTrue = true;
            },

            async get10PreviousPokemons(){
                if (this.offset >= this.limit) {
                    this.offset -= this.limit;
                await this.getData();
            }
        },

            showDescription(pokemon){
                this.ShowDesc = true
                this.PockemonChoisi = pokemon
            },

            PokemonCry(pokemon){                
                var audio = new Audio(`/www/Audio/${pokemon.Nom}.ogg`)
                audio.play()
                this.Vibrate()
            },

            Vibrate(){
                let element = document.getElementById('Vibration');
                let posX = 0;
                let posY = 0;

                function vibrate() {
                    posX = Math.floor(Math.random() * 5) - 2;
                    posY = Math.floor(Math.random() * 5) - 2;
                    element.style.transform = `translate(${posX}px, ${posY}px)`;
                }

                function stopVibration() {
                    clearInterval(interval);
                    element.style.transform = 'translate(0, 0)';
                }

                let interval = setInterval(vibrate, 50);
                setTimeout(stopVibration, 2000);
            }  
        },

        mounted() {
            this.getData()    
          }
    })
    myapp.mount('#app')
}
