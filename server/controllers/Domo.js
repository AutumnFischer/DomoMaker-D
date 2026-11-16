const makerPage = async (req, res) => {
    return res.render('app');
};

const models = require('../models');
const Domo = models.Domo;

const makeDomo = async (req, res) => {
    if(!req.body.name || !req.body.age || !req.body.favoriteColor){
        return res.status(400).json({ error: 'Both name, age, and favorite color are required!' })
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        favoriteColor: req.body.favoriteColor,
        owner: req.session.account._id,
    };

    try{
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({name: newDomo.name, age: newDomo.age, favoriteColor: newDomo.favoriteColor});
    } catch (err) {
        console.log(err);
        if(err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists! '});
        }
        return  res.status(500).json({ error: 'An error occured making domo!' });
    }
}

const getDomos = async (req, res) => {
    try{
        const query = {owner: req.session.account._id};
        const docs = await Domo.find(query).select('name age favoriteColor').lean().exec();

        return res.json({domos: docs});
    } catch (err){
        console.log(err);
        return res.status(500).json({error: 'Error retrieving domos!'});
    }
}

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
};