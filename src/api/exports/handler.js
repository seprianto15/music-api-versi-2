class ExportsHandler {
  constructor(service, servicePlaylist, validator) {
    this._service = service;
    this._validator = validator;
    this._servicePlaylist = servicePlaylist;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);

    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const verifyPlaylist = await this._servicePlaylist.verifyPlaylistAccess(playlistId,
      credentialId);

    const message = {
      verifyPlaylist,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
