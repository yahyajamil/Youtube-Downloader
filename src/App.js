import React, { Component } from 'react';
import './App.css'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      inputValue: '',
      id: ''
    }
  }

  inputValueHandler = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  extractVideoId = (url) => {
    const regex = /[?&]v=([^#&?]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  clickHandler = (e) => {
    e.preventDefault();

    if (this.state.inputValue === '') {
      console.log("No URL");
      return;
    }

    const id = this.extractVideoId(this.state.inputValue);

    if (id) {
      this.setState({ id }, () => {
        this.getData();
      });
    } else {
      console.log('Invalid YouTube URL');
    }
  };

  async getData() {
    try {
      const url = `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${this.state.id}`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'd40c265118mshdc90194a533aa99p18842bjsn18247c206e8e',
          'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com',
        },
      };

      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);

      this.setState({
        data: result,
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {


    return (
      <>
        <div className="app flex flex-col items-center">
          <div className="flex justify-center w-full h-svh font-newTimes ">
            <div className="container flex justify-center flex-col items-center">
              <h1 className="title text-red-600 text-3xl mb-1 font-semibold font-newTimes sm:text-5xl">Youtube Downloader <i
                className="fas"></i></h1>
              <p className="sub-title text-black text-lg sm:text-2xl">Download Youtube Videos For Free</p>
              <div className="mx-8">
                <form className="search-form mt-10 flex flex-col items-center sm:block">
                  <input id="s_input" type="search" name="q" className="bg-white px-2 py-3 w-80 sm:w-96 outline-none rounded font-sans"
                    value={this.state.inputValue} onChange={this.inputValueHandler} aria-label="Search" placeholder="Search or paste Youtube link here" autoComplete="off" required />
                  <button onClick={this.clickHandler} className="bg-red-600 text-white py-3 rounded px-4 mt-4 mx-2 font-semibold hover:bg-red-700 transition-all font-sans">Download</button>
                </form>
              </div>

            </div>
          </div>

          <div className="media-container">
            <div className="content">
              {this.state.data && this.state.data.formats && (
                this.state.data.formats.map((format, i) => (
                  <div className="item my-4 rounded" key={i}>
                    <img src={this.state.data.thumbnail[3].url} className="w-72 sm:w-96 object-contain rounded rounded-b-none" alt="" />
                    <div className="info bg-white p-5 rounded rounded-t-none">
                      <p className="name">{this.state.data.title.split(' ').slice(0, 4).join(' ')+"..."}</p>
                      <div className="action flex justify-between font-semibold">
                        <p className="video-resolution">{format.qualityLabel}</p>
                        <a download={format.url} href={format.url}><span>Download</span></a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="copyright">
            <span className="text-sm text-gray-500 font-sans block text-center">© 2024 all rights reserved. </span>
            <span className="text-gray-500 text-xs block text-center">Developed by <a href="/#" className="text-gray-700">Yahya Jamil</a></span>
          </div>
        </div>
      </>
    );
  }
}
