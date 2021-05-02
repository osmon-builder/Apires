'use strict'

var mongosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

function saveFollow(req, res) {
    var params = req.body;

    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if (err) return res.status(200).send({
            message: 'Error al guardar saveFollow()'
        })

        if (!followStored) return res.status(404).send({ message: 'El seguimiento no se a guardado retorno basio.' });


        return res.status(200).send({ follow: followStored });
    });

}

function deleteFollow(req, res) {

    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.find({ 'user': userId, 'followed': followId }).remove(err => {

        if (err) return res.status(500).send({ message: 'Error al dejar de siguir deleteFollow()' });
        return res.status(200).send({ message: 'El follow se ha eliminado.' });

    })


}

function getFollowingUsers(req, res) {
    var userId = req.user.sub;

    if (req.params.id && req.params.page) userId = req.params.id;//si queremos ver lo seguidores de otro usuario

    var page = 1;

    if (req.params.page) page = req.params.page
    else page = req.params.id;

    var itemsPerPage = 4;

    Follow.find({ user: userId }).populate({ path: 'followed' }).paginate(page, itemsPerPage, (err, follows, total) => {

        if (err) return res.status(500).send({ message: 'Error en el servidor getFollowingUsers()' });
        if (!follows) return res.status(404).send({ message: 'No estas siguiendo a ningun usuario' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows
        });

    });


}

function getFollowedUsers(req, res) {
    var userId = req.user.sub;

    if (req.params.id && req.params.page) userId = req.params.id;//si queremos ver lo seguidores de otro usuario

    var page = 1;

    if (req.params.page) page = req.params.page
    else page = req.params.id;

    var itemsPerPage = 4;

    Follow.find({ followed: userId }).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {

        if (err) return res.status(500).send({ message: 'Error en el servidor getFollowUsers()' });
        if (!follows) return res.status(404).send({ message: 'No tesigue ningun usuario' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows
        });

    });


}


//Devolver los usuarios que sigo o los que me estan siguiendo sin paginacion
function getMyFollows(req, res) {
    var userId = req.user.sub;

    var find = Follow.find({ followed: userId });

    if (req.params.followed) find = Follow.find({ followed: userId });

    find.populate('user followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor' });

        if (!follows) return res.status(404).send({ message: 'No sigues a ningun usuario' })

        return res.status(200).send({ follows });
    })
}
module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
};