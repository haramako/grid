#!/usr/bin/env ruby

#
#
#

require 'bundler/setup'
Bundler.require
require 'sinatra/reloader' if development?

require 'sinatra-websocket'

require 'pp'
require 'json'

set :server, 'thin'
set :sockets, []
set :public_dir, './public'

#get '/' do
#  erb :index
#end

class Table
  attr_accessor :data

  def initialize
    @data = {
      1=> {id: 1, name: 'hoge', age: 30},
      2=> {id: 2, name: 'fuga', age: 40},
      3=> {id: 3, name: 'piyo', age: 50},
    }
  end
  
  def find(id)
    r = @data[id]
    unless r
      r = @data[id] = {id: id, name: 'unkonwn', age: 0}
    end
    r
  end
end

class Repository
  attr_accessor :tables
  def initialize
    @tables = {people: Table.new}
  end

  def find(table, id)
    @tables[table].find(id)
  end
end

$repository = Repository.new


get '/websocket' do
  if request.websocket? then
    request.websocket do |ws|
      ws.onopen do
        settings.sockets << ws
      end
      ws.onmessage do |msg|
        begin
          settings.sockets.each do |s|
            process(s, msg)
          end
        rescue
          puts $!
          puts $!.backtrace[0..3]
        end
      end
      ws.onclose do
        settings.sockets.delete(ws)
      end
    end
  end
end


def find_data(id)
end

def process(s, req_str)
  req = JSON.parse(req_str, symbolize_names: true)
  puts req
  case req[:type]
  when 'insert'
  when 'update'
    row = $repository.find(:people, req[:id])
    row[req[:col].to_sym] = req[:newVal]
    s.send JSON.dump(['change', row])
  when 'delete'
  else
    raise 'ivalid command'
  end
end
