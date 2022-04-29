<template>
    <div class="meter" :style="{width: progress + '%'}"></div>
</template>

<script>
    export default {
        props: {
            progress: {
                type: Number,
                required: true
            }
        }
    }
</script>
