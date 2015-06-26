let loadedAudioPlayers = {};

export function getPlayer(trackId) {
    return loadedAudioPlayers[trackId] || null;
}

export function setPlayer(trackId, player) {
    loadedAudioPlayers[trackId] = player;
    return loadedAudioPlayers[trackId];
}
