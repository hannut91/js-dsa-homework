const _ = require('lodash');

const PASS = '.';
const BLOCK = 'x';
const DIRECTIONS = [
  {dx: 0, dy: -1, label: 'U'},
  {dx: 0, dy: +1, label: 'D'},
  {dx: -1, dy: 0, label: 'L'},
  {dx: +1, dy: 0, label: 'R'},
]

class Graph {
  load(board) {
    this.vertices = _.flatMap(board, (line, y) =>
      line.split('').map((_v, x) => `${x},${y}`)
    ).reduce((a, e) => ({ ...a, [e]: {} }), {});

    this.edges = _.flatMap(board, (line, y) => 
      _.flatMap(line.split(''), (v, x) => createEdges(board, x, y))
    );

    Object.keys(this.vertices).forEach(key => {
      this.vertices[key].position = key;
      this.vertices[key].color = 'white';
      this.vertices[key].edges = this.edges.filter(({ from }) => from === key);
    });
  }

  getDirections(x, y) {
    return this.edges
      .filter(({from}) => from === `${x},${y}`)
      .map(i => i.direction);
  }

  findPath(start, end) {
    const e = [];

    const step = (vertex, distance) => {
      if (vertex.position === end) {
        vertex.color = 'black';

        return this.pathToStart(vertex, start);
      }

      vertex.edges
        .filter(edge => this.vertices[edge.to].color === 'white')
        .forEach(edge => {
          const v = this.vertices[edge.to];
          v.from = edge;
          v.distance = distance + 1;
          v.color = 'gray';
        });

      vertex.color = 'black';

      const nextVertex = _.minBy(
        _.filter(this.vertices, ({color}) => color === 'gray'),
        ({distance}) => distance);

      return step(nextVertex, nextVertex.distance);
    };

    const vertex = this.vertices[start];
    vertex.distance = 0;
    vertex.color = 'black';
    const result = step(vertex, vertex.distance);

    return result.reverse();
  }

  pathToStart(vertex, start) {
    if (vertex.position === start) {
      return [];
    }

    return [vertex.from.direction]
      .concat(this.pathToStart(this.vertices[vertex.from.from], start));
  }
}

const createGraph = (board) => {
  const graph = new Graph();
  graph.load(board);
  return graph;
};

const createEdges = (board, x, y) => {
  if (board[y][x] === BLOCK) {
    return [];
  }

  return DIRECTIONS
    .map(({dx, dy, label}) => ({x: x + dx, y: y + dy, label}))
    .filter(({x}) => _.inRange(x, board[0].length - 1))
    .filter(({y}) => _.inRange(y, board.length - 1))
    .filter(({x: toX, y: toY}) => board[toY][toX] === PASS)
    .map(({x: toX, y: toY, label}) => ({
      from: `${x},${y}`,
      to: `${toX},${toY}`,
      direction: label
    }));
};

test('create graph', () => {
  const graph = createGraph([
    '.....',
    '.x...',
    '.xxx.',
    '.....',
    '..x..',
  ]);

  expect(graph.getDirections(0, 0)).toEqual(['D', 'R']);
  expect(graph.getDirections(1, 0)).toEqual(['L', 'R']);
});

test('create edges', () => {
  const board = [
    '.....',
    '.x...',
    '.xxx.',
    '.....',
    '..x..',
  ];

  expect(createEdges(board, 0, 0)).toEqual([
    {from: '0,0', to: `0,1`, direction: 'D'},
    {from: '0,0', to: `1,0`, direction: 'R'},
  ]);

  expect(createEdges(board, 1, 1)).toEqual([]);
});

test('find path', () => {
  const graph = createGraph([
    '.....',
    '.x...',
    '.xxx.',
    '.....',
    '..x..',

  ]);
  expect(graph.findPath('0,0', '2,1')).toEqual(['R', 'R', 'D']);
  expect(graph.findPath('0,0', '2,3')).toEqual(['D', 'D', 'D', 'R', 'R']);
});
