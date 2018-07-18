export default class SearchItem {
  public track: string;
  public artist: string;
  public link: string;
  public thumbnail: string;
  public artistId: string;
  constructor(item) {
    this.track = item.trackName;
    this.artist = item.artistName;
    this.link = item.trackViewUrl;
    this.thumbnail = item.artworkUrl30;
    this.artistId = item.artistId;
  }
}
