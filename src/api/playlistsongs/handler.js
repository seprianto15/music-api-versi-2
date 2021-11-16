class PlaylistSongsHandler {
  constructor(service, servicePlaylist, validator) {
    this._service = service;
    this._servicePlaylist = servicePlaylist;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._servicePlaylist.verifyPlaylistAccess(playlistId, credentialId);

    const playlistsongsId = await this._service.addPlaylistSong({ songId, playlistId });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
      data: {
        playlistsongsId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._servicePlaylist.verifyPlaylistAccess(playlistId, credentialId);

    const songs = await this._service.getPlaylistSong(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistSongHandler(request, h) {
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._servicePlaylist.verifyPlaylistAccess(playlistId, credentialId);

    const playlistsongsId = await this._service.deletePlaylistSongById(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
      data: {
        playlistsongsId,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistSongsHandler;
