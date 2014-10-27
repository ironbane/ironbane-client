angular.module('engine.input.virtual-gamepad', [])
    .factory('VirtualGamepad', function () {
        'use strict';

        // on detecting pointer events, create the pointer object to add to the collection
        // for different input type, show different color and text
        function createPointerObject(event) {
            //console.log('pointer event!!', event);
            var type, color;

            switch (event.pointerType) {
            case event.POINTER_TYPE_MOUSE || 'mouse':
                type = 'MOUSE';
                color = 'red';
                break;
            case event.POINTER_TYPE_PEN || 'pen':
                type = 'PEN';
                color = 'lime';
                break;
            case event.POINTER_TYPE_TOUCH || 'touch':
                type = 'TOUCH';
                color = 'cyan';
                break;
            }

            return {
                id: event.pointerId,
                x: event.clientX,
                y: event.clientY,
                type: type,
                color: color
            };
        }

        function onPointerDown(e) {
            this._pointers[e.pointerId] = createPointerObject(e);
        }

        function onPointerMove(e) {
            if (this._pointers[e.pointerId]) {
                this._pointers[e.pointerId].x = e.clientX;
                this._pointers[e.pointerId].y = e.clientY;
            }
        }

        function onPointerUp(e) {
            delete this._pointers[e.pointerId];
        }

        var VirtualGamepad = function () {
            // track touches / clicks
            this._pointers = {};

            // create overlay canvas
            this.canvas = document.createElement('canvas');

            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.position = 'absolute';
            this.canvas.style.backgroundColor = 'transparent';
            this.canvas.style.top = '0px';
            this.canvas.style.left = '0px';
            this.canvas.style.zIndex = '5';
            this.canvas.style.msTouchAction = 'none';
            this.canvas.style.touchAction = 'none';
            this.canvasContext = this.canvas.getContext('2d');
            this.canvasContext.strokeStyle = '#ffffff';
            this.canvasContext.lineWidth = 2;

            document.body.appendChild(this.canvas);

            this.canvas.addEventListener('pointerdown', onPointerDown.bind(this), false);
            this.canvas.addEventListener('pointermove', onPointerMove.bind(this), false);
            this.canvas.addEventListener('pointerup', onPointerUp.bind(this), false);
            this.canvas.addEventListener('pointerout', onPointerUp.bind(this), false);

            this.canvas.addEventListener('contextmenu', function (e) {
                e.preventDefault(); // Disables system menu
            }, false);
        };

        VirtualGamepad.prototype.draw = function () {
            var canvas = this.canvas,
                context = this.canvasContext,
                keys,
                self = this;

            context.clearRect(0, 0, canvas.width, canvas.height);

            keys = Object.keys(this._pointers);
            keys.forEach(function (pointerId) {
                var pointer = self._pointers[pointerId];

                context.beginPath();
                context.fillStyle = 'white';
                context.fillText(pointer.type + ' id : ' + pointer.id + ' x:' + pointer.x + ' y:' +
                    pointer.y, pointer.x + 30, pointer.y - 30);

                context.beginPath();
                context.strokeStyle = pointer.color;
                context.lineWidth = '6';
                context.arc(pointer.x, pointer.y, 40, 0, Math.PI * 2, true);
                context.stroke();
            });

            window.requestAnimationFrame(this.draw.bind(this));
        };

        return VirtualGamepad;
    });