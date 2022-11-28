<template>
  <div class="container-fluid">
    <div class="p-3 d-flex align-items-center justify-content-between">
        <div class="header-logo">
            <img src="~/assets/images/logo.png" alt=""/>
        </div>
        <div class="header-time">
            <img src="~/assets/images/time.png" alt=""/>
        </div>
        <div class="header-gift">
            <div><strong>Quà tặng</strong></div>
            <div class="header-gift-item">
                <img src="~/assets/images/gift.png" alt=""/>
            </div>
            <div class="header-gift-item">
                <img src="~/assets/images/gift.png" alt=""/>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.header-gift {
    border-radius: 30px;
    background: rgba(3, 179, 255, 1);
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 6px 12px 2px rgb(164, 220, 245);

    .header-gift-item {
        margin-left: 12px;
    }
}
</style>