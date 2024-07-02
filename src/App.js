import React, { Component } from "react";
import "./App.css";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      inputValue: "",
      id: "",
      format: "MP4",
    };
  }

  inputValueHandler = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  extractVideoId = (url) => {
    const regex =
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  formatHandler = (e) => {
    console.log(e.target.value);
    this.setState({ format: e.target.value });
  };

  clickHandler = (e) => {
    e.preventDefault();

    if (this.state.inputValue === "") {
      alert("No URL...");
      return;
    }

    const id = this.extractVideoId(this.state.inputValue);

    if (id) {
      this.setState({ id }, () => {
        this.getData();
      });
    } else {
      console.log("Invalid YouTube URL");
      alert("Invalid YouTube URL");
    }
  };

  async getData() {
    try {
      const url = `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${this.state.id}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "d40c265118mshdc90194a533aa99p18842bjsn18247c206e8e",
          "X-RapidAPI-Host": "ytstream-download-youtube-videos.p.rapidapi.com",
        },
      };

      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);

      const adaptiveFormats = result.adaptiveFormats || [];
      const uniqueFormats = [];
      const seenQualities = new Set();

      adaptiveFormats.forEach((format) => {
        if (this.state.format === "MP3") {
          if (format.audioQuality && !seenQualities.has(format.audioQuality)) {
            uniqueFormats.push(format);
            seenQualities.add(format.audioQuality);
          }
        } else {
          if (format.qualityLabel && !seenQualities.has(format.qualityLabel)) {
            uniqueFormats.push(format);
            seenQualities.add(format.qualityLabel);
          }
        }
      });

      this.setState({
        data: {
          ...result,
          adaptiveFormats: uniqueFormats,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { format, data } = this.state;

    // Filter and display formats based on the selected format type
    const filteredFormats =
      format === "MP3"
        ? data?.adaptiveFormats?.filter(
            (f) => f.audioQuality && !f.mimeType.includes("video")
          ) || []
        : data?.adaptiveFormats?.filter(
            (f) => f.qualityLabel && !f.mimeType.includes("audio")
          ) || [];
    console.log(filteredFormats);
    return (
      <>
        <div className="app flex justify-between flex-col items-center w-full h-screen font-newTimes">
          <div className="flex justify-center py-16">
            <div className="container flex justify-center flex-col items-center">
              <div className="title-container py-16 z-10">
                <h1 className="z-20 text-center title text-red-600 text-3xl mb-1 font-semibold font-newTimes sm:text-5xl">
                  Youtube Downloader <i className="fas"></i>
                </h1>
                <p className="sub-title text-black text-lg sm:text-2xl text-center">
                  Download Youtube Videos For Free
                </p>
              </div>
              <div className="formats mb-6">
                <div className="formats-container bg-white rounded-lg">
                  <button
                    className={
                      format === "MP4"
                        ? "font-sans bg-red-400 transition-all ease-in-out py-2 px-4 rounded-s-md"
                        : "font-sans bg-white py-2 px-4 rounded-s-md"
                    }
                    onClick={this.formatHandler}
                    value={"MP4"}
                  >
                    MP4
                  </button>
                  <button
                    className={
                      format === "MP3"
                        ? "font-sans bg-red-400 py-2 transition-all ease-in-out px-4 rounded-e-md"
                        : "font-sans bg-white py-2 px-4 rounded-e-md"
                    }
                    onClick={this.formatHandler}
                    value={"MP3"}
                  >
                    MP3
                  </button>
                </div>
              </div>
              <div className="mx-8">
                <form className="search-form flex flex-col items-center sm:block">
                  <input
                    id="s_input"
                    type="search"
                    name="q"
                    className="bg-white px-2 py-3 w-80 sm:w-96 outline-none rounded font-sans"
                    value={this.state.inputValue}
                    onChange={this.inputValueHandler}
                    aria-label="Search"
                    placeholder="Search or paste Youtube link here"
                    autoComplete="off"
                    required
                  />
                  <button
                    onClick={this.clickHandler}
                    className="bg-red-600 text-white py-3 rounded px-4 mt-4 mx-2 font-semibold hover:bg-red-700 transition-all font-sans"
                  >
                    Download
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="media-container">
            {data && (
              <div className="content bg-white rounded">
                <div className="item my-4 rounded">
                  <img
                    src={data.thumbnail[3].url}
                    className="w-72 sm:w-96 object-contain rounded rounded-b-none"
                    alt=""
                  />
                  <p className="name p-2">
                    {data.title.split(" ").slice(0, 4).join(" ") + "..."}
                  </p>
                  {filteredFormats.map((format, i) => (
                    <div
                      className="info bg-white p-2 rounded rounded-t-none"
                      key={i}
                    >
                      <div className="action flex justify-between font-semibold">
                        <p className="video-resolution">
                          {format.qualityLabel || format.audioQuality}
                        </p>
                        <a download={format.url} href={format.url}>
                          <button className="bg-blue-600 py-1 px-3 rounded-lg">
                            <span className="text-white font-sans">Download</span>
                          </button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="copyright mb-28">
            <span className="text-sm text-gray-500 font-sans block text-center">
              © 2024 all rights reserved.{" "}
            </span>
            <span className="text-gray-500 font-sans text-xs block text-center">
              Developed by{" "}
              <a
                href="https://yahyajamil.github.io/"
                target="_blank"
                className="text-gray-700"
              >
                Yahya Jamil
              </a>
            </span>
          </div>
        </div>
      </>
    );
  }
}
