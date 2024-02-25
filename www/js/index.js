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
                PockemonChoisi : null
            }
        },
        methods: {
            async getData() {
                fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${this.offset}&limit='${10}'`)
                .then(res => res.json())
                .then(finalRes => {
                
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
                        this.Description.push(abilities)
                        console.log(abilities)
                    })
                })
                });
              },
              
            async get10nextPokemons(){
                this.offset += 10;
                await this.getData();
            },

            async get10PreviousPokemons(){
                this.offset -=10;
                await this.getData();
                this.isTrue = true;
            },

            showDescription(pokemon){
                this.ShowDesc = true
                this.PockemonChoisi = pokemon
            }
        },
        mounted() {
            this.getData()
          }
    })
    myapp.mount('#app')
}
