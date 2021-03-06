const connection = require('./connection')

module.exports = {
    getBeers: getBeers,
    getRecipeGrains: getRecipeGrains,
    getRecipeHops: getRecipeHops,
    getRecipeYeasts: getRecipeYeasts,
}

function getBeers(db = connection) {
    return db('beers').select()
}

function getRecipeGrains(beer_id, db = connection) {
    return db('beers').select()
        .where('id', beer_id)
        .then(beers => {
            return Promise.all(beers.map(beer => {
                return db('grains')
                    .join('beers_grains', 'beers_grains.grain_id', 'grains.id')
                    .where('beers_grains.beer_id', beer.id)
                    .select('grains.*', 'beers_grains.amount')
                    .then(grains => {
                        beer.grains = grains
                        return beer
                    })
            }))
        })
        .then(beer => {
            return beer
        })
}

function getRecipeHops(recipe, db = connection) {
    return db('beers').select()
        .where('id', recipe[0].id)
        .then(beers => {
            return Promise.all(beers.map(beer => {
                return db('hops')
                    .join('beers_hops', 'beers_hops.hop_id', 'hops.id')
                    .where('beers_hops.beer_id', beer.id)
                    .select('hops.*', 'beers_hops.total_amount', 'beers_hops.instructions')
                    .then(hops => {
                        recipe[0].hops = hops
                        return recipe
                    })
            }))
        })
}

function getRecipeYeasts(recipe, db = connection) {
    return db('beers').select()
        .where('id', recipe[0].id)
        .then(beers => {
            return Promise.all(beers.map(beer => {
                return db('yeasts')
                    .join('beers_yeasts', 'beers_yeasts.yeast_id', 'yeasts.id')
                    .where('beers_yeasts.beer_id', beer.id)
                    .select('yeasts.*', 'beers_yeasts.amount')
                    .then(yeast => {
                        recipe[0].yeast = yeast
                        return recipe
                    })
            }))
        })
}
