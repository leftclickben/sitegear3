# Sitegear3

[![Build Status](https://secure.travis-ci.org/sitegear/sitegear3.png?branch=master)](http://travis-ci.org/sitegear/sitegear3)

Simple website framework and decoupled web content management system, written entirely in javascript.

This project is very much a work in progress.  Please see also the original Sitegear written in PHP (http://github.com/sitegearphp/sitegear).

## Application

The application extends the express application object, adding some startup methods which provide automatic configuration, routing, etc.

In general, anything that can be done with an express application instance can be done with a sitegear3 application instance.

## Modules

Modules encapsulate the data and logic related to a group of related functionality.  Modules are "vertical" in the sense that they cross over multiple application layers (persistence, routing, "business" logic, view preparation), but relate to only a single functional area (e.g. products or bookings or customer accounts).

A module's external interface consists of:

 * Action methods, which are mapped to URLs using the routing engine provided by express.
 * TODO Complete this list

## Data

Sitegear3 is agnostic to persistence layers.  You can store your data directly in JSON files, which is not very scalable but does not have many dependencies, or any kind of database or data storage mechanism that you choose.

Data is accessed through a standard API, and the engine takes care of knowing which driver is being used, as well as providing some standardised functionality such as event emission.

Repositories are key-value document / object stores created by modules to store a specific type of data.  A JSON schema is (optionally) specified for the objects stored in the repository.

## Middleware

Some middleware is provided by Sitegear3 and is recommended for it to operate correctly.  See the demo site for details (http://github.com/sitegear3/sitegear3-demo)

## View Helpers

Some view helpers are provided and passed to view scripts by the `prepareView` view helper.  These view helpers are "global" and are available in any view script.

## Content Management

TODO
